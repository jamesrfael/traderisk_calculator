// src/components/SideBar.js
import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Pressable, Animated } from "react-native";
import Octicons from "react-native-vector-icons/Octicons";
import { useTheme } from "../theme";
import getStyles from "../styles/createStyles";

export default function SideBar({
  fade,
  slideX,
  insets,
  aboutOpen,
  setAboutOpen,
  closeDrawer,
  clearDefaults,
  onTutorialPress, // NEW
}) {
  const theme = useTheme();
  const styles = getStyles(theme);

  const handlePress = () => {
    closeDrawer?.();
  };

  return (
    <View
      style={[
        styles.drawerOverlay,
        {
          top: 0,
          bottom: -insets.bottom,
          left: -insets.left,
          right: -insets.right,
        },
      ]}
    >
      <Animated.View style={[styles.backdrop, { opacity: fade }]} />
      <View style={styles.overlayRow}>
        <Animated.View
          style={[
            styles.drawer,
            {
              transform: [{ translateX: slideX }],
              paddingTop: insets.top + 12,
              paddingBottom: insets.bottom + 12,
            },
          ]}
        >
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerTitle}>Menu</Text>
            <TouchableOpacity onPress={closeDrawer} style={styles.closeBtn}>
              <Octicons name="x" size={18} color={theme.inputText} />
            </TouchableOpacity>
          </View>

          <View style={styles.drawerBody}>
            <ScrollView contentContainerStyle={styles.drawerScrollContent}>
              <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => {
                  onTutorialPress?.();
                }}
              >
                <Text style={styles.drawerText}>Tutorial</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.drawerItem} onPress={handlePress}>
                <Text style={styles.drawerText}>Subscription</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.drawerItem} onPress={handlePress}>
                <Text style={styles.drawerText}>FAQ</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.drawerItem} onPress={handlePress}>
                <Text style={styles.drawerText}>Feedback & Suggestions</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.drawerItem} onPress={handlePress}>
                <Text style={styles.drawerText}>Rate Us</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.drawerItemRow} onPress={() => setAboutOpen((v) => !v)}>
                <Text style={styles.drawerText}>About Us</Text>
                <Octicons name={aboutOpen ? "chevron-up" : "chevron-down"} size={18} color={theme.inputText} />
              </TouchableOpacity>

              {aboutOpen && (
                <View style={styles.subList}>
                  <TouchableOpacity style={styles.subItem} onPress={handlePress}>
                    <Text style={styles.subText}>Special Thanks</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.subItem} onPress={handlePress}>
                    <Text style={styles.subText}>Privacy Policy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.subItem} onPress={handlePress}>
                    <Text style={styles.subText}>Terms of Service</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.subItem} onPress={handlePress}>
                    <Text style={styles.subText}>Report a Bug</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>

            <TouchableOpacity style={[styles.clearBtn, { marginBottom: insets.bottom + 8 }]} onPress={clearDefaults}>
              <Text style={styles.clearBtnText}>Clear Defaults</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Pressable style={styles.hitArea} onPress={closeDrawer} />
      </View>
    </View>
  );
}
