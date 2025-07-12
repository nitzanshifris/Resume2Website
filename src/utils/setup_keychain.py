#!/usr/bin/env python3
"""
Setup script to store credentials in macOS Keychain
Run this once to securely store your credentials
"""
from src.core.local.keychain_manager import KeychainManager
import getpass


def main():
    print("CV2WEB Keychain Setup")
    print("=" * 50)
    print("This will store your credentials securely in macOS Keychain")
    print("Your keys will NEVER appear in files or logs")
    print()
    
    # Google Cloud Vision Setup
    print("1. Google Cloud Vision Setup")
    print("-" * 30)
    google_path = input("Enter path to Google service account JSON (or press Enter to skip): ").strip()
    if google_path:
        if KeychainManager.set_credential('google_credentials_path', google_path):
            print("✅ Google credentials path stored in Keychain")
        else:
            print("❌ Failed to store Google credentials")
    print()
    
    # AWS Setup
    print("2. AWS Textract Setup")
    print("-" * 30)
    aws_setup = input("Setup AWS credentials? (y/n): ").lower()
    if aws_setup == 'y':
        access_key = input("AWS Access Key ID: ").strip()
        secret_key = getpass.getpass("AWS Secret Access Key: ").strip()
        region = input("AWS Region (default: us-east-1): ").strip() or "us-east-1"
        
        if access_key and secret_key:
            KeychainManager.set_credential('aws_access_key_id', access_key)
            KeychainManager.set_credential('aws_secret_access_key', secret_key)
            KeychainManager.set_credential('aws_region', region)
            print("✅ AWS credentials stored in Keychain")
    print()
    
    # OpenAI Setup
    print("3. OpenAI API Setup")
    print("-" * 30)
    openai_setup = input("Setup OpenAI API key? (y/n): ").lower()
    if openai_setup == 'y':
        api_key = getpass.getpass("OpenAI API Key (sk-...): ").strip()
        if api_key:
            KeychainManager.set_credential('openai_api_key', api_key)
            print("✅ OpenAI API key stored in Keychain")
    print()
    
    # Anthropic Setup
    print("4. Anthropic (Claude) API Setup")
    print("-" * 30)
    anthropic_setup = input("Setup Anthropic API key? (y/n): ").lower()
    if anthropic_setup == 'y':
        api_key = getpass.getpass("Anthropic API Key (sk-ant-...): ").strip()
        if api_key:
            KeychainManager.set_credential('anthropic_api_key', api_key)
            print("✅ Anthropic API key stored in Keychain")
    print()
    
    # Gemini API Setup
    print("5. Google Gemini API Setup")
    print("-" * 30)
    gemini_setup = input("Setup Gemini API key? (y/n): ").lower()
    if gemini_setup == 'y':
        api_key = getpass.getpass("Gemini API Key: ").strip()
        if api_key:
            KeychainManager.set_credential('gemini_api_key', api_key)
            print("✅ Gemini API key stored in Keychain")
    print()
    
    # Vercel Setup
    print("6. Vercel Setup")
    print("-" * 30)
    vercel_setup = input("Setup Vercel credentials? (y/n): ").lower()
    if vercel_setup == 'y':
        vercel_id = input("Vercel ID: ").strip()
        vercel_secret = getpass.getpass("Vercel Secret: ").strip()
        if vercel_id and vercel_secret:
            KeychainManager.set_credential('vercel_id', vercel_id)
            KeychainManager.set_credential('vercel_secret', vercel_secret)
            print("✅ Vercel credentials stored in Keychain")
    print()
    
    # Pinecone Setup
    print("7. Pinecone Setup (Optional)")
    print("-" * 30)
    pinecone_setup = input("Setup Pinecone API key? (y/n): ").lower()
    if pinecone_setup == 'y':
        api_key = getpass.getpass("Pinecone API Key: ").strip()
        environment = input("Pinecone Environment (e.g., us-east-1-aws): ").strip()
        if api_key:
            KeychainManager.set_credential('pinecone_api_key', api_key)
            if environment:
                KeychainManager.set_credential('pinecone_environment', environment)
            print("✅ Pinecone credentials stored in Keychain")
    
    print()
    print("Setup complete! Your credentials are securely stored in macOS Keychain.")
    print("You can now run the application without exposing any keys.")
    print()
    print("To verify your credentials are stored, you can check in:")
    print("Keychain Access app > login > search for 'cv2web'")


if __name__ == "__main__":
    main()