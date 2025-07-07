# Multiply-AI chatbot

### Motivation

It was sometimes annoing to search for some ambigious information and compare results from different ai providers. So I decided to create my own app, which would integrate multiple providers in one place. With the ability to **pass conversation across** them.
I didnt do any research and I don't claim this is an original approach. Nevertheless I have a pleasure to present my personal solution.

#### History

I started with custom response stream implementation, but later decided to use poverfull AI-SDK from Vercel to avoid unnecessarily boilerplate.

#### Currently

So far it is a raw version with core functionality. Until now it supports openAi and anthropic API only, but extending it to any provider that offers an API access is just a matter of time.  
 Custom API_key may be added for single request. And prefernces can be saved in local storage.
In further I plan among others:

- authorization && authentification
- chat history for logged users
- maintain prefernces and keys in external DB (the keys storage comes with encoding/decoding issue ofc)

Generally there are a lot of features to implement (e.g. handling attachments, voice implementation and more over...). So looks like I won't be bored any time soon 😎
