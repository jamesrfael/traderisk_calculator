// app/_layout.js
import React from "react";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" options={{ title: "Risk Calculator", headerShown: false }} />
      <Stack.Screen name="sidebar_items/tutorial" options={{ title: "Tutorial" }} />
      <Stack.Screen name="sidebar_items/subscription" options={{ title: "Subscription" }} />
      <Stack.Screen name="sidebar_items/faq" options={{ title: "FAQ" }} />
      <Stack.Screen name="sidebar_items/feedback" options={{ title: "Feedback & Suggestions" }} />
      <Stack.Screen name="sidebar_items/about/special-thanks" options={{ title: "Special Thanks" }} />
      <Stack.Screen name="sidebar_items/about/privacy-policy" options={{ title: "Privacy Policy" }} />
      <Stack.Screen name="sidebar_items/about/terms" options={{ title: "Terms of Service" }} />
      <Stack.Screen name="sidebar_items/about/bug-report" options={{ title: "Report a Bug" }} />
    </Stack>
  );
}
