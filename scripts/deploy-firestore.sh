#!/bin/bash

# KAYA Social Media - Firestore Deployment Script
# This script deploys Firestore security rules and indexes

echo "🚀 Deploying KAYA Social Media Firestore Configuration..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed. Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
    echo "❌ Not logged in to Firebase. Please login first:"
    echo "firebase login"
    exit 1
fi

echo "📋 Current Firebase project:"
firebase use

echo ""
read -p "🤔 Is this the correct project? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please set the correct project with: firebase use <project-id>"
    exit 1
fi

echo ""
echo "🔐 Deploying Firestore Security Rules..."
firebase deploy --only firestore:rules

if [ $? -eq 0 ]; then
    echo "✅ Security rules deployed successfully!"
else
    echo "❌ Failed to deploy security rules"
    exit 1
fi

echo ""
echo "📊 Deploying Firestore Indexes..."
firebase deploy --only firestore:indexes

if [ $? -eq 0 ]; then
    echo "✅ Firestore indexes deployed successfully!"
    echo ""
    echo "🎉 KAYA Social Media Firestore configuration deployed!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Wait for indexes to build (check Firebase Console)"
    echo "2. Test notifications functionality"
    echo "3. Verify all features are working"
    echo ""
    echo "🔗 Firebase Console: https://console.firebase.google.com/project/$(firebase use)/firestore"
else
    echo "❌ Failed to deploy Firestore indexes"
    exit 1
fi
