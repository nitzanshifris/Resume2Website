"""
Claude SDK Portfolio Domain Expert Service

This service creates a domain expert chat system for portfolio generation
using Claude SDK. It works with CV data from our extraction system to
provide personalized portfolio guidance and generation.
"""

import json
import uuid
import asyncio
from typing import Dict, Any, List, Optional, AsyncGenerator
from datetime import datetime
from pathlib import Path

from src.core.schemas.unified_nullable import CVData
from src.utils.enhanced_sse_logger import EnhancedSSELogger, WorkflowPhase
from src.services.correlation_manager import CorrelationManager
from src.services.metrics_collector import MetricsCollector

class ClaudePortfolioExpert:
    """
    Domain expert for portfolio generation using Claude SDK.
    
    This class provides an AI-powered chat interface that understands
    CV data and guides users through portfolio creation decisions.
    """
    
    def __init__(self):
        self.name = "portfolio_expert"
        self.sandbox_base_path = Path("sandboxes/portfolios")
        self.sandbox_base_path.mkdir(parents=True, exist_ok=True)
        
        # Initialize components
        self.correlation_manager = CorrelationManager()
        self.metrics_collector = MetricsCollector()
        
        # Domain expertise configuration
        self.expert_config = {
            "specializations": [
                "Portfolio design principles",
                "CV data interpretation",
                "Industry-specific portfolio needs",
                "Modern web development practices", 
                "User experience optimization",
                "Personal branding strategies"
            ],
            "supported_industries": [
                "Technology", "Design", "Marketing", "Finance", 
                "Healthcare", "Education", "Legal", "Creative"
            ],
            "portfolio_types": [
                "Professional", "Creative", "Technical", "Academic",
                "Executive", "Startup", "Freelancer"
            ]
        }
    
    async def start_expert_session(self, cv_data: CVData, user_preferences: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Start a new expert chat session with the user.
        
        Args:
            cv_data: Extracted CV data from Gemini
            user_preferences: Optional user preferences for portfolio style
            
        Returns:
            Session information including session_id and initial expert message
        """
        session_id = str(uuid.uuid4())
        correlation_id = self.correlation_manager.create_context().correlation_id
        
        # Initialize SSE logger for this session
        sse_logger = EnhancedSSELogger(
            workflow_name="portfolio_expert_session",
            workflow_id=session_id
        )
        
        sse_logger.start_phase(WorkflowPhase.VALIDATION, expected_steps=3)
        sse_logger.step("expert_initialization", {
            "session_id": session_id,
            "correlation_id": correlation_id,
            "cv_sections": list(cv_data.model_dump_nullable().keys())
        })
        
        # Analyze CV data for expert insights
        cv_analysis = await self._analyze_cv_data(cv_data, sse_logger)
        
        # Generate personalized expert greeting
        expert_greeting = await self._generate_expert_greeting(cv_data, cv_analysis, sse_logger)
        
        # Create session state
        session_state = {
            "session_id": session_id,
            "correlation_id": correlation_id,
            "cv_data": cv_data.model_dump_nullable(),
            "cv_analysis": cv_analysis,
            "user_preferences": user_preferences or {},
            "conversation_history": [],
            "expert_recommendations": [],
            "created_at": datetime.now().isoformat(),
            "status": "active"
        }
        
        sse_logger.step("session_created", {"session_id": session_id})
        sse_logger.end_phase(WorkflowPhase.VALIDATION)
        
        return {
            "session_id": session_id,
            "expert_message": expert_greeting,
            "cv_analysis": cv_analysis,
            "expert_config": self.expert_config,
            "session_state": session_state
        }
    
    async def _analyze_cv_data(self, cv_data: CVData, sse_logger: EnhancedSSELogger) -> Dict[str, Any]:
        """
        Analyze CV data to provide expert insights.
        
        Args:
            cv_data: Extracted CV data
            sse_logger: Logger for tracking analysis steps
            
        Returns:
            Analysis results with insights and recommendations
        """
        sse_logger.step("cv_analysis_start", {"status": "analyzing_cv_structure"})
        
        analysis = {
            "profile_strength": {},
            "content_insights": {},
            "portfolio_recommendations": {},
            "missing_elements": [],
            "strengths": [],
            "industry_indicators": []
        }
        
        # Analyze profile completeness
        profile_sections = {
            "hero": cv_data.hero is not None,
            "experience": cv_data.experience is not None,
            "education": cv_data.education is not None,
            "skills": cv_data.skills is not None,
            "projects": cv_data.projects is not None,
            "contact": cv_data.contact is not None
        }
        
        completeness_score = sum(profile_sections.values()) / len(profile_sections)
        analysis["profile_strength"] = {
            "completeness_score": completeness_score,
            "sections_present": profile_sections,
            "total_sections": len(profile_sections)
        }
        
        # Analyze content for insights
        if cv_data.hero and cv_data.hero.professionalTitle:
            analysis["content_insights"]["primary_role"] = cv_data.hero.professionalTitle
        
        if cv_data.experience and cv_data.experience.experienceItems:
            experience_count = len(cv_data.experience.experienceItems)
            analysis["content_insights"]["experience_level"] = self._categorize_experience_level(experience_count)
        
        # Identify industry from role and experience
        industry = self._identify_industry(cv_data)
        if industry:
            analysis["industry_indicators"].append(industry)
        
        # Generate recommendations based on analysis
        recommendations = self._generate_portfolio_recommendations(cv_data, analysis)
        analysis["portfolio_recommendations"] = recommendations
        
        sse_logger.step("cv_analysis_complete", {
            "completeness_score": completeness_score,
            "industry": industry,
            "recommendations_count": len(recommendations)
        })
        
        return analysis
    
    def _categorize_experience_level(self, experience_count: int) -> str:
        """Categorize experience level based on job count."""
        if experience_count == 0:
            return "entry_level"
        elif experience_count <= 2:
            return "junior"
        elif experience_count <= 5:
            return "mid_level"
        else:
            return "senior"
    
    def _identify_industry(self, cv_data: CVData) -> Optional[str]:
        """Identify industry based on role and experience."""
        if not cv_data.hero or not cv_data.hero.professionalTitle:
            return None
        
        title = cv_data.hero.professionalTitle.lower()
        
        # Simple industry mapping
        industry_keywords = {
            "technology": ["developer", "engineer", "programmer", "software", "tech", "data", "ai", "ml"],
            "design": ["designer", "creative", "ux", "ui", "graphic", "visual"],
            "marketing": ["marketing", "digital", "seo", "content", "social media", "brand"],
            "finance": ["finance", "accounting", "analyst", "banking", "investment"],
            "healthcare": ["doctor", "nurse", "medical", "healthcare", "clinical"],
            "education": ["teacher", "professor", "education", "training", "academic"],
            "legal": ["lawyer", "attorney", "legal", "paralegal", "counsel"],
            "creative": ["artist", "writer", "photographer", "musician", "creative"]
        }
        
        for industry, keywords in industry_keywords.items():
            if any(keyword in title for keyword in keywords):
                return industry
        
        return "general"
    
    def _generate_portfolio_recommendations(self, cv_data: CVData, analysis: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate portfolio recommendations based on CV analysis."""
        recommendations = []
        
        # Recommend based on industry
        industry = analysis.get("industry_indicators", [])
        if industry:
            primary_industry = industry[0]
            recommendations.append({
                "type": "industry_focus",
                "title": f"Optimize for {primary_industry.title()} Industry",
                "description": f"Your portfolio should highlight {primary_industry}-specific skills and projects",
                "priority": "high"
            })
        
        # Recommend based on completeness
        completeness = analysis["profile_strength"]["completeness_score"]
        if completeness < 0.7:
            recommendations.append({
                "type": "content_enhancement",
                "title": "Strengthen Portfolio Content",
                "description": "Consider adding more sections like projects, achievements, or certifications",
                "priority": "medium"
            })
        
        # Recommend based on experience level
        experience_level = analysis["content_insights"].get("experience_level", "entry_level")
        if experience_level == "senior":
            recommendations.append({
                "type": "leadership_focus",
                "title": "Highlight Leadership Experience",
                "description": "Emphasize management, mentoring, and strategic contributions",
                "priority": "high"
            })
        
        return recommendations
    
    async def _generate_expert_greeting(self, cv_data: CVData, analysis: Dict[str, Any], sse_logger: EnhancedSSELogger) -> str:
        """Generate personalized expert greeting based on CV analysis."""
        sse_logger.step("generating_expert_greeting", {"status": "creating_personalized_message"})
        
        # Extract key information
        name = cv_data.hero.fullName if cv_data.hero and cv_data.hero.fullName else "there"
        role = cv_data.hero.professionalTitle if cv_data.hero and cv_data.hero.professionalTitle else "professional"
        industry = analysis.get("industry_indicators", ["general"])[0]
        completeness = analysis["profile_strength"]["completeness_score"]
        
        # Generate personalized greeting
        greeting = f"Hello {name}! 👋\n\n"
        greeting += f"I'm your portfolio domain expert, and I've analyzed your CV. I can see you're a {role} "
        
        if industry != "general":
            greeting += f"with {industry} expertise. "
        
        greeting += f"Your profile shows a {completeness:.0%} completeness score, which is "
        if completeness >= 0.8:
            greeting += "excellent! "
        elif completeness >= 0.6:
            greeting += "good, with room for enhancement. "
        else:
            greeting += "a great starting point that we can build upon. "
        
        greeting += "\n\nI'm here to help you create a portfolio that:\n"
        greeting += "✨ Showcases your unique strengths\n"
        greeting += "🎯 Targets your specific industry needs\n"
        greeting += "🚀 Stands out to employers and clients\n"
        greeting += "📱 Works perfectly across all devices\n\n"
        
        # Add specific recommendations
        recommendations = analysis.get("portfolio_recommendations", [])
        if recommendations:
            greeting += "Based on your CV, I recommend we focus on:\n"
            for rec in recommendations[:3]:  # Show top 3 recommendations
                greeting += f"• {rec['title']}\n"
        
        greeting += "\nWhat would you like to explore first? I can help you with:\n"
        greeting += "1. **Portfolio Style** - Choose a design that matches your industry\n"
        greeting += "2. **Content Strategy** - Optimize how we present your experience\n"
        greeting += "3. **Technical Setup** - Create a modern, responsive portfolio\n"
        greeting += "4. **Quick Generation** - Generate a complete portfolio right now\n\n"
        greeting += "Just let me know what interests you most, or ask me anything about portfolio creation!"
        
        sse_logger.step("expert_greeting_generated", {"greeting_length": len(greeting)})
        
        return greeting
    
    async def chat_with_expert(self, session_id: str, user_message: str, session_state: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process user message and generate expert response.
        
        Args:
            session_id: Unique session identifier
            user_message: User's message to the expert
            session_state: Current session state
            
        Returns:
            Expert response with updated session state
        """
        correlation_id = session_state.get("correlation_id")
        
        # Initialize SSE logger for this chat interaction
        sse_logger = EnhancedSSELogger(
            workflow_name="portfolio_expert_chat",
            workflow_id=session_id
        )
        
        sse_logger.start_phase(WorkflowPhase.PROCESSING, expected_steps=4)
        sse_logger.step("processing_user_message", {
            "session_id": session_id,
            "message_length": len(user_message)
        })
        
        # Analyze user intent
        intent = await self._analyze_user_intent(user_message, session_state, sse_logger)
        
        # Generate expert response based on intent
        expert_response = await self._generate_expert_response(intent, user_message, session_state, sse_logger)
        
        # Update conversation history
        session_state["conversation_history"].append({
            "timestamp": datetime.now().isoformat(),
            "user_message": user_message,
            "expert_response": expert_response,
            "intent": intent
        })
        
        sse_logger.step("conversation_updated", {
            "total_messages": len(session_state["conversation_history"])
        })
        
        sse_logger.end_phase(WorkflowPhase.PROCESSING)
        
        return {
            "expert_response": expert_response,
            "intent": intent,
            "session_state": session_state,
            "suggestions": await self._generate_follow_up_suggestions(intent, session_state)
        }
    
    async def _analyze_user_intent(self, user_message: str, session_state: Dict[str, Any], sse_logger: EnhancedSSELogger) -> Dict[str, Any]:
        """Analyze user message to determine intent."""
        sse_logger.step("analyzing_intent", {"message": user_message[:100]})
        
        message_lower = user_message.lower()
        
        # Simple intent classification
        intent = {
            "category": "general",
            "confidence": 0.5,
            "keywords": [],
            "action_needed": False
        }
        
        # Intent patterns
        intent_patterns = {
            "style_preference": ["style", "design", "look", "appearance", "theme", "color"],
            "content_question": ["content", "what should", "how to", "include", "add", "section"],
            "technical_setup": ["technical", "code", "development", "build", "deploy", "hosting"],
            "generation_request": ["generate", "create", "build", "make", "start", "let's do"],
            "industry_specific": ["industry", "field", "professional", "career", "job", "employer"]
        }
        
        for category, keywords in intent_patterns.items():
            matches = [kw for kw in keywords if kw in message_lower]
            if matches:
                intent["category"] = category
                intent["keywords"] = matches
                intent["confidence"] = min(1.0, len(matches) * 0.3)
                break
        
        # Check if user wants to generate portfolio
        if any(word in message_lower for word in ["generate", "create", "build", "make portfolio"]):
            intent["action_needed"] = True
        
        sse_logger.step("intent_analyzed", {
            "category": intent["category"],
            "confidence": intent["confidence"],
            "action_needed": intent["action_needed"]
        })
        
        return intent
    
    async def _generate_expert_response(self, intent: Dict[str, Any], user_message: str, session_state: Dict[str, Any], sse_logger: EnhancedSSELogger) -> str:
        """Generate expert response based on user intent."""
        sse_logger.step("generating_expert_response", {"intent": intent["category"]})
        
        cv_data = session_state["cv_data"]
        cv_analysis = session_state["cv_analysis"]
        
        # Get user's name for personalization
        name = cv_data.get("hero", {}).get("fullName", "").split(" ")[0] if cv_data.get("hero", {}).get("fullName") else ""
        
        category = intent["category"]
        
        if category == "style_preference":
            response = await self._generate_style_response(cv_data, cv_analysis, name)
        elif category == "content_question":
            response = await self._generate_content_response(cv_data, cv_analysis, name)
        elif category == "technical_setup":
            response = await self._generate_technical_response(cv_data, cv_analysis, name)
        elif category == "generation_request":
            response = await self._generate_generation_response(cv_data, cv_analysis, name)
        elif category == "industry_specific":
            response = await self._generate_industry_response(cv_data, cv_analysis, name)
        else:
            response = await self._generate_general_response(cv_data, cv_analysis, name, user_message)
        
        sse_logger.step("expert_response_generated", {"response_length": len(response)})
        
        return response
    
    async def _generate_style_response(self, cv_data: Dict[str, Any], cv_analysis: Dict[str, Any], name: str) -> str:
        """Generate response for style-related questions."""
        industry = cv_analysis.get("industry_indicators", ["general"])[0]
        
        response = f"Great question about portfolio style, {name}! 🎨\n\n"
        response += f"Based on your {industry} background, I'd recommend:\n\n"
        
        if industry == "technology":
            response += "**Tech-Focused Style:**\n"
            response += "• Clean, minimalist design with dark mode option\n"
            response += "• Code syntax highlighting for projects\n"
            response += "• Interactive elements showing your technical skills\n"
            response += "• Modern typography with good readability\n"
        elif industry == "design":
            response += "**Creative-Focused Style:**\n"
            response += "• Visually striking design showcasing your aesthetic sense\n"
            response += "• Rich media gallery for your work\n"
            response += "• Custom animations and transitions\n"
            response += "• Bold color scheme that reflects your brand\n"
        elif industry == "marketing":
            response += "**Marketing-Focused Style:**\n"
            response += "• Conversion-optimized design with clear CTAs\n"
            response += "• Social proof and testimonials prominently featured\n"
            response += "• Data visualization for campaign results\n"
            response += "• Professional yet approachable aesthetic\n"
        else:
            response += "**Professional Style:**\n"
            response += "• Clean, professional design that works for any industry\n"
            response += "• Balanced use of white space and content\n"
            response += "• Consistent branding throughout\n"
            response += "• Mobile-first responsive design\n"
        
        response += "\nWould you like me to create a portfolio with one of these styles, or do you have specific preferences in mind?"
        
        return response
    
    async def _generate_content_response(self, cv_data: Dict[str, Any], cv_analysis: Dict[str, Any], name: str) -> str:
        """Generate response for content-related questions."""
        completeness = cv_analysis["profile_strength"]["completeness_score"]
        
        response = f"Excellent question about content, {name}! 📝\n\n"
        response += f"Your current profile is {completeness:.0%} complete. Here's what I recommend:\n\n"
        
        response += "**Essential Sections:**\n"
        sections = cv_analysis["profile_strength"]["sections_present"]
        
        if sections.get("hero"):
            response += "✅ Professional Introduction - You have this!\n"
        else:
            response += "❌ Professional Introduction - Let's add this\n"
        
        if sections.get("experience"):
            response += "✅ Work Experience - You have this!\n"
        else:
            response += "❌ Work Experience - This is crucial to add\n"
        
        if sections.get("skills"):
            response += "✅ Skills Section - You have this!\n"
        else:
            response += "❌ Skills Section - Let's showcase your abilities\n"
        
        if sections.get("projects"):
            response += "✅ Projects Portfolio - You have this!\n"
        else:
            response += "💡 Projects Portfolio - This would strengthen your profile\n"
        
        response += "\n**Content Enhancement Tips:**\n"
        response += "• Use action verbs and quantify achievements\n"
        response += "• Include relevant keywords for your industry\n"
        response += "• Tell a cohesive story about your career journey\n"
        response += "• Showcase your unique value proposition\n"
        
        response += "\nShould I generate a portfolio that optimizes your existing content and suggests areas for improvement?"
        
        return response
    
    async def _generate_technical_response(self, cv_data: Dict[str, Any], cv_analysis: Dict[str, Any], name: str) -> str:
        """Generate response for technical questions."""
        response = f"Great technical question, {name}! 🛠️\n\n"
        response += "I'll create a modern, production-ready portfolio with:\n\n"
        
        response += "**Technical Stack:**\n"
        response += "• Next.js 15 with TypeScript for robust development\n"
        response += "• Tailwind CSS v4 for responsive, utility-first styling\n"
        response += "• Modern React patterns with hooks and components\n"
        response += "• Optimized images and assets for fast loading\n"
        response += "• SEO-friendly structure with meta tags\n\n"
        
        response += "**Performance Features:**\n"
        response += "• Server-side rendering for better SEO\n"
        response += "• Lazy loading for images and components\n"
        response += "• Optimized bundle size with code splitting\n"
        response += "• Progressive Web App (PWA) capabilities\n"
        response += "• 95+ Lighthouse performance score\n\n"
        
        response += "**Deployment Options:**\n"
        response += "• One-click Vercel deployment\n"
        response += "• Custom domain support\n"
        response += "• SSL certificate included\n"
        response += "• Global CDN for fast worldwide access\n\n"
        
        response += "Would you like me to generate a portfolio with these technical specifications?"
        
        return response
    
    async def _generate_generation_response(self, cv_data: Dict[str, Any], cv_analysis: Dict[str, Any], name: str) -> str:
        """Generate response for portfolio generation requests."""
        response = f"Absolutely, {name}! Let's create your portfolio! 🚀\n\n"
        response += "Based on your CV analysis, I'll generate a portfolio that:\n\n"
        
        industry = cv_analysis.get("industry_indicators", ["general"])[0]
        response += f"**Optimized for {industry.title()}:**\n"
        
        if industry == "technology":
            response += "• Showcases your technical projects and skills\n"
            response += "• Includes code examples and GitHub integration\n"
            response += "• Features a clean, developer-friendly design\n"
        elif industry == "design":
            response += "• Highlights your creative portfolio and process\n"
            response += "• Includes visual galleries and case studies\n"
            response += "• Features bold, aesthetic-driven design\n"
        else:
            response += "• Presents your professional experience effectively\n"
            response += "• Includes relevant achievements and metrics\n"
            response += "• Features a clean, industry-appropriate design\n"
        
        response += "\n**What I'll Create:**\n"
        response += "• Responsive portfolio website (mobile & desktop)\n"
        response += "• Professional sections based on your CV data\n"
        response += "• Modern animations and interactions\n"
        response += "• Contact form and social media integration\n"
        response += "• Ready-to-deploy code with hosting setup\n\n"
        
        response += "Ready to start? I'll generate your portfolio in a secure sandbox environment "
        response += "where you can preview everything before it goes live.\n\n"
        response += "Should I begin the generation process now?"
        
        return response
    
    async def _generate_industry_response(self, cv_data: Dict[str, Any], cv_analysis: Dict[str, Any], name: str) -> str:
        """Generate response for industry-specific questions."""
        industry = cv_analysis.get("industry_indicators", ["general"])[0]
        
        response = f"Great question about {industry} portfolios, {name}! 🎯\n\n"
        
        if industry == "technology":
            response += "**Tech Industry Portfolio Essentials:**\n"
            response += "• Technical skills prominently displayed\n"
            response += "• GitHub repositories and contributions\n"
            response += "• Live project demos with code examples\n"
            response += "• Technical blog or articles (if available)\n"
            response += "• Problem-solving approach documentation\n"
        elif industry == "design":
            response += "**Design Industry Portfolio Essentials:**\n"
            response += "• Visual portfolio showcasing your best work\n"
            response += "• Case studies explaining your design process\n"
            response += "• Before/after examples of your impact\n"
            response += "• Client testimonials and feedback\n"
            response += "• Design philosophy and approach\n"
        elif industry == "marketing":
            response += "**Marketing Industry Portfolio Essentials:**\n"
            response += "• Campaign results with metrics and ROI\n"
            response += "• Multi-channel marketing examples\n"
            response += "• Analytics and data-driven insights\n"
            response += "• Brand development case studies\n"
            response += "• Creative assets and campaigns\n"
        else:
            response += "**Professional Portfolio Essentials:**\n"
            response += "• Clear presentation of your expertise\n"
            response += "• Quantified achievements and results\n"
            response += "• Professional recommendations\n"
            response += "• Industry-relevant projects\n"
            response += "• Thought leadership content\n"
        
        response += "\n**Industry-Specific Tips:**\n"
        response += f"• Use terminology and keywords common in {industry}\n"
        response += f"• Highlight achievements that matter to {industry} employers\n"
        response += f"• Include relevant certifications and training\n"
        response += f"• Show understanding of {industry} trends and challenges\n\n"
        
        response += f"Should I create a portfolio optimized specifically for the {industry} industry?"
        
        return response
    
    async def _generate_general_response(self, cv_data: Dict[str, Any], cv_analysis: Dict[str, Any], name: str, user_message: str) -> str:
        """Generate general response for unclassified messages."""
        response = f"Thanks for your question, {name}! 💡\n\n"
        response += "I'm here to help you create the perfect portfolio. I can assist with:\n\n"
        
        response += "**Portfolio Strategy:**\n"
        response += "• Choosing the right design style for your industry\n"
        response += "• Optimizing content to showcase your strengths\n"
        response += "• Structuring information for maximum impact\n\n"
        
        response += "**Technical Implementation:**\n"
        response += "• Modern, responsive web development\n"
        response += "• SEO optimization for better visibility\n"
        response += "• Performance optimization for fast loading\n\n"
        
        response += "**Content Guidance:**\n"
        response += "• Writing compelling professional summaries\n"
        response += "• Presenting projects and achievements effectively\n"
        response += "• Creating engaging call-to-action sections\n\n"
        
        response += "What specific aspect of portfolio creation interests you most? "
        response += "Or would you like me to generate a complete portfolio based on your CV data?"
        
        return response
    
    async def _generate_follow_up_suggestions(self, intent: Dict[str, Any], session_state: Dict[str, Any]) -> List[str]:
        """Generate follow-up suggestions based on the conversation."""
        suggestions = []
        
        category = intent["category"]
        
        if category == "style_preference":
            suggestions = [
                "Show me color scheme options",
                "What about typography choices?",
                "Generate a portfolio with this style",
                "How does this work on mobile?"
            ]
        elif category == "content_question":
            suggestions = [
                "Help me improve my professional summary",
                "What projects should I highlight?",
                "Generate portfolio with optimized content",
                "How can I quantify my achievements?"
            ]
        elif category == "technical_setup":
            suggestions = [
                "Start the portfolio generation",
                "What hosting options are available?",
                "How do I customize the code?",
                "Show me deployment process"
            ]
        elif category == "generation_request":
            suggestions = [
                "Yes, generate my portfolio now",
                "Let me review the style options first",
                "What will the final result include?",
                "How long will generation take?"
            ]
        else:
            suggestions = [
                "Generate my portfolio",
                "Show me style options",
                "Help with content strategy",
                "Explain technical details"
            ]
        
        return suggestions
    
    async def generate_portfolio_in_sandbox(self, session_id: str, session_state: Dict[str, Any], generation_preferences: Dict[str, Any] = None) -> AsyncGenerator[Dict[str, Any], None]:
        """
        Generate portfolio in isolated sandbox environment.
        
        This method creates a complete Next.js portfolio application
        based on the user's CV data and preferences.
        """
        correlation_id = session_state.get("correlation_id")
        cv_data = session_state["cv_data"]
        
        # Initialize SSE logger for portfolio generation
        sse_logger = EnhancedSSELogger(
            workflow_name="portfolio_generation",
            workflow_id=session_id
        )
        
        # Start generation workflow
        sse_logger.start_phase(WorkflowPhase.GENERATION, expected_steps=8)
        
        # Step 1: Create sandbox environment
        sse_logger.step("creating_sandbox", {"session_id": session_id})
        sandbox_path = self.sandbox_base_path / session_id
        sandbox_path.mkdir(parents=True, exist_ok=True)
        
        yield {
            "type": "progress",
            "step": "sandbox_created",
            "message": "Created isolated sandbox environment",
            "progress": 12.5
        }
        
        # Step 2: Generate portfolio structure
        sse_logger.step("generating_structure", {"sandbox_path": str(sandbox_path)})
        
        # This is where we would integrate with Claude SDK
        # For now, we'll create a structured plan
        portfolio_plan = await self._create_portfolio_plan(cv_data, generation_preferences or {})
        
        yield {
            "type": "progress", 
            "step": "structure_planned",
            "message": "Created portfolio structure plan",
            "progress": 25,
            "plan": portfolio_plan
        }
        
        # Step 3: Generate package.json and dependencies
        sse_logger.step("generating_package_json", {"dependencies": "next.js, tailwind, typescript"})
        
        package_json = await self._generate_package_json(portfolio_plan)
        
        with open(sandbox_path / "package.json", "w") as f:
            json.dump(package_json, f, indent=2)
        
        yield {
            "type": "progress",
            "step": "dependencies_configured", 
            "message": "Configured project dependencies",
            "progress": 37.5
        }
        
        # Step 4: Generate Next.js configuration
        sse_logger.step("generating_nextjs_config", {"features": "typescript, tailwind, optimization"})
        
        nextjs_config = await self._generate_nextjs_config(portfolio_plan)
        
        with open(sandbox_path / "next.config.js", "w") as f:
            f.write(nextjs_config)
        
        yield {
            "type": "progress",
            "step": "nextjs_configured",
            "message": "Generated Next.js configuration",
            "progress": 50
        }
        
        # Step 5: Generate Tailwind configuration
        sse_logger.step("generating_tailwind_config", {"theme": portfolio_plan.get("theme", "professional")})
        
        tailwind_config = await self._generate_tailwind_config(portfolio_plan)
        
        with open(sandbox_path / "tailwind.config.js", "w") as f:
            f.write(tailwind_config)
        
        yield {
            "type": "progress",
            "step": "styling_configured",
            "message": "Generated Tailwind CSS configuration",
            "progress": 62.5
        }
        
        # Step 6: Generate portfolio components
        sse_logger.step("generating_components", {"components": portfolio_plan.get("components", [])})
        
        components = await self._generate_portfolio_components(cv_data, portfolio_plan)
        
        # Create app directory structure
        app_dir = sandbox_path / "app"
        app_dir.mkdir(exist_ok=True)
        
        # Generate main page
        with open(app_dir / "page.tsx", "w") as f:
            f.write(components["main_page"])
        
        # Generate layout
        with open(app_dir / "layout.tsx", "w") as f:
            f.write(components["layout"])
        
        # Generate global styles
        with open(app_dir / "globals.css", "w") as f:
            f.write(components["global_styles"])
        
        yield {
            "type": "progress",
            "step": "components_generated",
            "message": "Generated portfolio components",
            "progress": 75
        }
        
        # Step 7: Generate TypeScript configuration
        sse_logger.step("generating_typescript_config", {"strict": True})
        
        typescript_config = await self._generate_typescript_config()
        
        with open(sandbox_path / "tsconfig.json", "w") as f:
            json.dump(typescript_config, f, indent=2)
        
        yield {
            "type": "progress",
            "step": "typescript_configured",
            "message": "Generated TypeScript configuration",
            "progress": 87.5
        }
        
        # Step 8: Create preview URL and finalize
        sse_logger.step("creating_preview_url", {"sandbox_id": session_id})
        
        preview_url = f"http://localhost:3000/preview/{session_id}"
        
        with open(sandbox_path / "preview.url", "w") as f:
            f.write(preview_url)
        
        sse_logger.step("portfolio_generation_complete", {
            "sandbox_path": str(sandbox_path),
            "preview_url": preview_url,
            "files_generated": len(list(sandbox_path.glob("**/*")))
        })
        
        sse_logger.end_phase(WorkflowPhase.GENERATION)
        
        yield {
            "type": "complete",
            "step": "generation_complete",
            "message": "Portfolio generation completed successfully",
            "progress": 100,
            "preview_url": preview_url,
            "sandbox_path": str(sandbox_path),
            "files_generated": len(list(sandbox_path.glob("**/*")))
        }
    
    async def _create_portfolio_plan(self, cv_data: Dict[str, Any], preferences: Dict[str, Any]) -> Dict[str, Any]:
        """Create a structured plan for portfolio generation."""
        plan = {
            "theme": preferences.get("theme", "professional"),
            "industry": preferences.get("industry", "general"),
            "components": [],
            "sections": [],
            "styling": {},
            "features": []
        }
        
        # Determine components based on CV data
        if cv_data.get("hero"):
            plan["components"].append("hero_section")
            plan["sections"].append("hero")
        
        if cv_data.get("experience"):
            plan["components"].append("experience_section")
            plan["sections"].append("experience")
        
        if cv_data.get("skills"):
            plan["components"].append("skills_section")
            plan["sections"].append("skills")
        
        if cv_data.get("projects"):
            plan["components"].append("projects_section")
            plan["sections"].append("projects")
        
        if cv_data.get("education"):
            plan["components"].append("education_section")
            plan["sections"].append("education")
        
        if cv_data.get("contact"):
            plan["components"].append("contact_section")
            plan["sections"].append("contact")
        
        # Add default components
        plan["components"].extend(["navigation", "footer"])
        
        # Configure styling based on theme
        if plan["theme"] == "professional":
            plan["styling"] = {
                "primary_color": "#2563eb",
                "secondary_color": "#64748b",
                "accent_color": "#0f172a",
                "font_family": "Inter, system-ui, sans-serif"
            }
        elif plan["theme"] == "creative":
            plan["styling"] = {
                "primary_color": "#8b5cf6",
                "secondary_color": "#f59e0b",
                "accent_color": "#1f2937",
                "font_family": "Poppins, system-ui, sans-serif"
            }
        
        # Add features
        plan["features"] = [
            "responsive_design",
            "dark_mode_toggle",
            "smooth_scrolling",
            "contact_form",
            "seo_optimization"
        ]
        
        return plan
    
    async def _generate_package_json(self, plan: Dict[str, Any]) -> Dict[str, Any]:
        """Generate package.json for the portfolio."""
        return {
            "name": "cv2web-portfolio",
            "version": "1.0.0",
            "private": True,
            "scripts": {
                "dev": "next dev",
                "build": "next build",
                "start": "next start",
                "lint": "next lint"
            },
            "dependencies": {
                "next": "15.0.0",
                "react": "^18.2.0",
                "react-dom": "^18.2.0",
                "typescript": "^5.0.0",
                "@types/node": "^20.0.0",
                "@types/react": "^18.2.0",
                "@types/react-dom": "^18.2.0",
                "tailwindcss": "^3.4.0",
                "autoprefixer": "^10.4.0",
                "postcss": "^8.4.0",
                "lucide-react": "^0.263.0",
                "framer-motion": "^10.16.0"
            },
            "devDependencies": {
                "eslint": "^8.0.0",
                "eslint-config-next": "15.0.0"
            }
        }
    
    async def _generate_nextjs_config(self, plan: Dict[str, Any]) -> str:
        """Generate Next.js configuration."""
        return '''/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
  async redirects() {
    return []
  },
}

module.exports = nextConfig
'''
    
    async def _generate_tailwind_config(self, plan: Dict[str, Any]) -> str:
        """Generate Tailwind CSS configuration."""
        styling = plan.get("styling", {})
        
        return f'''/** @type {{import('tailwindcss').Config}} */
module.exports = {{
  content: [
    './pages/**/*.{{js,ts,jsx,tsx,mdx}}',
    './components/**/*.{{js,ts,jsx,tsx,mdx}}',
    './app/**/*.{{js,ts,jsx,tsx,mdx}}',
  ],
  theme: {{
    extend: {{
      colors: {{
        primary: '{styling.get("primary_color", "#2563eb")}',
        secondary: '{styling.get("secondary_color", "#64748b")}',
        accent: '{styling.get("accent_color", "#0f172a")}',
      }},
      fontFamily: {{
        sans: ['{styling.get("font_family", "Inter, system-ui, sans-serif")}'],
      }},
    }},
  }},
  plugins: [],
}}
'''
    
    async def _generate_typescript_config(self) -> Dict[str, Any]:
        """Generate TypeScript configuration."""
        return {
            "compilerOptions": {
                "target": "es5",
                "lib": ["dom", "dom.iterable", "es6"],
                "allowJs": True,
                "skipLibCheck": True,
                "strict": True,
                "forceConsistentCasingInFileNames": True,
                "noEmit": True,
                "esModuleInterop": True,
                "module": "esnext",
                "moduleResolution": "node",
                "resolveJsonModule": True,
                "isolatedModules": True,
                "jsx": "preserve",
                "incremental": True,
                "plugins": [
                    {
                        "name": "next"
                    }
                ],
                "baseUrl": ".",
                "paths": {
                    "@/*": ["./src/*"]
                }
            },
            "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
            "exclude": ["node_modules"]
        }
    
    async def _generate_portfolio_components(self, cv_data: Dict[str, Any], plan: Dict[str, Any]) -> Dict[str, str]:
        """Generate portfolio components based on CV data."""
        components = {}
        
        # Generate main page
        components["main_page"] = await self._generate_main_page(cv_data, plan)
        
        # Generate layout
        components["layout"] = await self._generate_layout(cv_data, plan)
        
        # Generate global styles
        components["global_styles"] = await self._generate_global_styles(plan)
        
        return components
    
    async def _generate_main_page(self, cv_data: Dict[str, Any], plan: Dict[str, Any]) -> str:
        """Generate the main page component."""
        hero = cv_data.get("hero", {})
        experience = cv_data.get("experience", {})
        skills = cv_data.get("skills", {})
        projects = cv_data.get("projects", {})
        education = cv_data.get("education", {})
        contact = cv_data.get("contact", {})
        
        name = hero.get("fullName", "Professional Portfolio")
        title = hero.get("professionalTitle", "Professional")
        summary = hero.get("summaryTagline", "")
        
        # Build experience section
        experience_section = ""
        if experience.get("experienceItems"):
            exp_items = ''.join([
                f'<div className="border-l-4 border-blue-500 pl-6">'
                f'<h3 className="text-xl font-semibold text-gray-900">{item.get("jobTitle", "Position")}</h3>'
                f'<p className="text-gray-600 mb-2">{item.get("companyName", "Company")} • {item.get("dateRange", {}).get("startDate", "")} - {item.get("dateRange", {}).get("endDate", "Present")}</p>'
                f'<p className="text-gray-700">{item.get("summary", "")}</p>'
                f'</div>'
                for item in experience.get("experienceItems", [])[:3]
            ])
            experience_section = f'<section className="py-16 px-4 bg-white"><div className="max-w-4xl mx-auto"><h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Experience</h2><div className="space-y-8">{exp_items}</div></div></section>'
        
        # Build skills section  
        skills_section = ""
        if skills.get("skillCategories"):
            skill_categories = ""
            for category in skills.get("skillCategories", [])[:6]:
                skill_spans = ''.join([f'<span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">{skill}</span>' for skill in category.get("skills", [])[:5]])
                skill_categories += f'<div className="bg-white p-6 rounded-lg shadow-md"><h3 className="text-lg font-semibold text-gray-900 mb-4">{category.get("categoryName", "Skills")}</h3><div className="flex flex-wrap gap-2">{skill_spans}</div></div>'
            skills_section = f'<section className="py-16 px-4 bg-gray-50"><div className="max-w-4xl mx-auto"><h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Skills</h2><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{skill_categories}</div></div></section>'
        
        # Build contact links
        contact_email = f'<a href="mailto:{contact.get("email")}" className="text-blue-400 hover:text-blue-300 transition-colors">{contact.get("email")}</a>' if contact.get("email") else ""
        contact_phone = f'<span className="text-gray-300">{contact.get("phone")}</span>' if contact.get("phone") else ""
        
        # Build summary paragraph
        summary_html = f'<p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">{summary}</p>' if summary else ""
        
        return f'''export default function HomePage() {{
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {{/* Hero Section */}}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {name}
          </h1>
          <h2 className="text-2xl text-gray-600 mb-6">
            {title}
          </h2>
          {summary_html}
          <div className="flex justify-center space-x-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors">
              Contact Me
            </button>
            <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg transition-colors">
              View Projects
            </button>
          </div>
        </div>
      </section>

      {experience_section}

      {skills_section}

      {{/* Contact Section */}}
      <section className="py-16 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">
            Get In Touch
          </h2>
          <p className="text-gray-300 mb-8">
            Ready to work together? Let's discuss your next project.
          </p>
          <div className="flex justify-center space-x-6">
            {contact_email}
            {contact_phone}
          </div>
        </div>
      </section>
    </div>
  );
}}'''
    
    async def _generate_layout(self, cv_data: Dict[str, Any], plan: Dict[str, Any]) -> str:
        """Generate the layout component."""
        hero = cv_data.get("hero", {})
        name = hero.get("fullName", "Portfolio")
        
        return f'''import {{ Inter }} from 'next/font/google'
import './globals.css'

const inter = Inter({{ subsets: ['latin'] }})

export const metadata = {{
  title: '{name} - Professional Portfolio',
  description: 'Professional portfolio showcasing experience, skills, and projects.',
}}

export default function RootLayout({{
  children,
}}: {{
  children: React.ReactNode
}}) {{
  return (
    <html lang="en">
      <body className={{inter.className}}>
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0">
                <span className="text-xl font-bold text-gray-900">
                  {name.split(" ")[0] if name else "Portfolio"}
                </span>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <a href="#home" className="text-gray-900 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                    Home
                  </a>
                  <a href="#experience" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                    Experience
                  </a>
                  <a href="#skills" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                    Skills
                  </a>
                  <a href="#contact" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                    Contact
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
        
        <main>
          {{children}}
        </main>
        
        <footer className="bg-gray-800 text-white py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-gray-400">
                © {{new Date().getFullYear()}} {name}. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}}
'''
    
    async def _generate_global_styles(self, plan: Dict[str, Any]) -> str:
        """Generate global CSS styles."""
        return '''@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }
  
  body {
    @apply text-gray-900 bg-white;
  }
}

@layer components {
  .btn-primary {
    @apply bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200;
  }
  
  .btn-secondary {
    @apply border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg transition-colors duration-200;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }
  
  .section-title {
    @apply text-3xl font-bold text-gray-900 mb-8 text-center;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
'''