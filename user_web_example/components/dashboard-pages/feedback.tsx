"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Star, 
  Send, 
  User, 
  Bot,
  Heart,
  Zap,
  Bug,
  Lightbulb
} from "lucide-react"
import { cn } from "@/lib/utils"

interface FeedbackProps {
  userName?: string
}

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
}

const quickFeedbackOptions = [
  { id: "love", icon: Heart, label: "Love it!", color: "text-red-500 bg-red-50 hover:bg-red-100" },
  { id: "great", icon: ThumbsUp, label: "Great job", color: "text-green-500 bg-green-50 hover:bg-green-100" },
  { id: "good", icon: Star, label: "Pretty good", color: "text-yellow-500 bg-yellow-50 hover:bg-yellow-100" },
  { id: "ok", icon: ThumbsDown, label: "Could be better", color: "text-orange-500 bg-orange-50 hover:bg-orange-100" },
]

const feedbackCategories = [
  { id: "feature", icon: Zap, label: "Feature Request", description: "Suggest new features or improvements" },
  { id: "bug", icon: Bug, label: "Bug Report", description: "Report technical issues or bugs" },
  { id: "general", icon: MessageSquare, label: "General Feedback", description: "Share your thoughts and experiences" },
  { id: "idea", icon: Lightbulb, label: "Ideas", description: "Share creative ideas or suggestions" },
]

export default function Feedback({ userName = "Alex" }: FeedbackProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: "Hi there! 👋 I'm here to help you share feedback about your experience with Resume2Website. What would you like to tell us?",
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [detailedFeedback, setDetailedFeedback] = useState("")
  const [rating, setRating] = useState<number>(0)

  const sendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date()
    }

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: "bot", 
      content: "Thank you for your feedback! We really appreciate you taking the time to share your thoughts. Our team will review this and get back to you if needed.",
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage, botResponse])
    setInputMessage("")
  }

  const handleQuickFeedback = (option: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: `Quick feedback: ${quickFeedbackOptions.find(o => o.id === option)?.label}`,
      timestamp: new Date()
    }

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: "bot",
      content: "Thanks for the quick feedback! 🙏 Would you like to share any specific details about your experience?",
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage, botResponse])
  }

  const submitDetailedFeedback = () => {
    if (!selectedCategory || !detailedFeedback.trim()) return

    const category = feedbackCategories.find(c => c.id === selectedCategory)
    // Submit feedback logic here
    
    // Reset form
    setSelectedCategory(null)
    setDetailedFeedback("")
    setRating(0)
    
    // Show success message
    alert("Thank you for your detailed feedback! We'll review it and get back to you.")
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Feedback</h1>
            <p className="text-gray-600">Help us improve Resume2Website with your thoughts and suggestions</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Feedback */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Feedback</h2>
          <p className="text-gray-600 mb-6">How was your experience with Resume2Website?</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {quickFeedbackOptions.map((option) => {
              const Icon = option.icon
              return (
                <button
                  key={option.id}
                  onClick={() => handleQuickFeedback(option.id)}
                  className={cn(
                    "p-4 rounded-lg border-2 border-transparent transition-all duration-200 text-center hover:border-gray-200",
                    option.color
                  )}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              )
            })}
          </div>
        </Card>
      </motion.div>

      {/* Chat Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Chat with Us</h2>
          
          {/* Messages */}
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.type === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "flex gap-3 max-w-[80%]",
                  message.type === "user" ? "flex-row-reverse" : "flex-row"
                )}>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    message.type === "user" 
                      ? "bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600" 
                      : "bg-gray-100"
                  )}>
                    {message.type === "user" ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                  
                  <div className={cn(
                    "px-4 py-2 rounded-lg",
                    message.type === "user"
                      ? "bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  )}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-3">
            <Input
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage}
              className="bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 hover:from-emerald-600 hover:via-sky-500 hover:to-blue-700 text-white border-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Detailed Feedback Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Detailed Feedback</h2>
          <p className="text-gray-600 mb-6">Help us understand your experience better</p>
          
          {/* Category Selection */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Feedback Category</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {feedbackCategories.map((category) => {
                const Icon = category.icon
                const isSelected = selectedCategory === category.id
                
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all duration-200 text-left",
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        isSelected ? "bg-blue-100" : "bg-gray-100"
                      )}>
                        <Icon className={cn(
                          "w-4 h-4",
                          isSelected ? "text-blue-600" : "text-gray-600"
                        )} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{category.label}</h4>
                        <p className="text-sm text-gray-600">{category.description}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Overall Rating</h3>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-colors duration-200"
                >
                  <Star className={cn(
                    "w-6 h-6",
                    star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
                  )} />
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Text */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Your Feedback</h3>
            <Textarea
              placeholder="Tell us about your experience, suggestions, or any issues you've encountered..."
              value={detailedFeedback}
              onChange={(e) => setDetailedFeedback(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button 
            onClick={submitDetailedFeedback}
            disabled={!selectedCategory || !detailedFeedback.trim()}
            className="w-full bg-gradient-to-r from-emerald-500 via-sky-400 to-blue-600 hover:from-emerald-600 hover:via-sky-500 hover:to-blue-700 text-white border-0"
          >
            Submit Feedback
          </Button>
        </Card>
      </motion.div>
    </div>
  )
} 