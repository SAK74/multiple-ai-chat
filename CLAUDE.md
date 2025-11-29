# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Dev server**: `npm run dev` - Starts Next.js development server with Turbopack
- **Build**: `npm run build` - Creates production build
- **Start**: `npm start` - Runs production server
- **Lint**: `npm run lint` - Runs Next.js linting
- **Database**: `npm run postinstall` - Generates Prisma client and runs migrations

## Architecture Overview

This is a multi-AI provider chatbot application built with Next.js that allows users to chat with different AI providers (OpenAI, Anthropic, Google) and transfer conversations between them.

### Key Components

**Authentication & Database**
- NextAuth.js with Prisma adapter for authentication
- PostgreSQL database with Prisma ORM
- User sessions with JWT strategy
- Chat history persistence for authenticated users

**AI Provider Integration**
- Uses Vercel AI SDK for streaming responses
- Supports OpenAI, Anthropic (Claude), and Google (Gemini) providers
- Custom API key support for single requests
- Provider switching within conversations
- Model selection per provider

**Core Architecture**
- `src/app/api/aichat/route.ts` - Main chat API endpoint handling streaming responses
- `src/app/api/aichat/getModel.ts` - Provider and model configuration
- `src/auth.ts` & `src/auth.config.ts` - Authentication setup
- `prisma/schema.prisma` - Database schema with User, Chat, Message models

**Frontend Structure**
- `src/app/[[...chatId]]/page.tsx` - Dynamic chat page routing
- `src/app/_components/Chat.tsx` - Main chat interface
- `src/app/_components/sidebar/` - Chat history and navigation
- `src/app/_components/prompt/` - Input handling with image attachment support

**Key Features**
- Image attachment with compression (Sharp.js)
- Markdown rendering with syntax highlighting (react-markdown + rehype-highlight)
- LocalStorage for preferences and API keys
- Real-time streaming responses with usage tracking
- Chat export and management

### Database Schema

- **User**: Basic user info with OAuth accounts
- **Chat**: Chat sessions belonging to users
- **Message**: Individual messages with role, content, and provider annotations
- **Account**: OAuth provider accounts (NextAuth)

### Provider System

Each AI provider is configured in `getModel.ts` with specific models and capabilities. The system tracks which provider generated each response through message annotations.