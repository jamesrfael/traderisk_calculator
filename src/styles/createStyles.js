import { StyleSheet, Dimensions, Platform } from "react-native";
const { width } = Dimensions.get("window");

const getStyles = (theme, drawerWidthParam = Math.round(width * 0.8)) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: theme.background },

    header: {
      paddingTop: Platform.OS === "ios" ? 44 : 34,
      paddingBottom: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.headerBorder,
      backgroundColor: theme.headerBg,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      zIndex: 2,
    },
    headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
    menuBtn: { padding: 8, marginLeft: -8 },
    headerTitle: { color: theme.headerText, fontSize: 18, fontWeight: "800", letterSpacing: 0.3 },
    themeToggle: { padding: 8 },

    drawerOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 3 },
    backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,1)" },
    overlayRow: { flex: 1, flexDirection: "row" },

    drawer: {
      width: drawerWidthParam,
      height: "100%",
      backgroundColor: theme.cardBg,
      borderRightWidth: 1,
      borderRightColor: theme.cardBorder,
      paddingHorizontal: 14,
      shadowOpacity: 0.3,
      shadowRadius: 8,
      shadowOffset: { width: 2, height: 0 },
      elevation: 6,
    },

    hitArea: { flex: 1 },

    drawerHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
    closeBtn: { padding: 6, marginRight: -6 },
    drawerTitle: { color: theme.outValue, fontSize: 16, fontWeight: "800" },

    drawerBody: { flex: 1 },
    drawerScrollContent: { paddingBottom: 16 },

    drawerItem: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.outBorder },
    drawerItemRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.outBorder, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    drawerText: { color: theme.inputText, fontSize: 14, fontWeight: "600" },

    subList: { paddingLeft: 10, backgroundColor: theme.inputBg, borderRadius: 8, marginTop: 8, marginBottom: 6 },
    subItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.inputBorder },
    subText: { color: theme.miniBtnText, fontSize: 13 },

    clearBtn: { marginTop: "auto", backgroundColor: theme.buttonBg, borderRadius: 10, paddingVertical: 14, alignItems: "center" },
    clearBtnText: { color: theme.buttonText, fontWeight: "800" },

    container: { padding: 16, paddingBottom: 40 },
    card: { backgroundColor: theme.cardBg, borderColor: theme.cardBorder, borderWidth: 1, borderRadius: 16, padding: 18 },

    fieldWrap: { marginBottom: 12 },
    labelRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
    label: { color: theme.label, fontSize: 12, paddingLeft: 6 },
    hint: { color: theme.hint, fontSize: 12, paddingRight: 9 },
    inputRow: { position: "relative" },
    input: { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, borderWidth: 1, color: theme.inputText, paddingVertical: 14, paddingHorizontal: 14, borderRadius: 12, fontSize: 16 },

    miniBtn: { position: "absolute", right: 6, top: 6, bottom: 6, borderRadius: 10, backgroundColor: theme.miniBtnBg, borderWidth: 1, borderColor: theme.miniBtnBorder, paddingHorizontal: 10, alignItems: "center", justifyContent: "center" },
    miniBtnText: { color: theme.miniBtnText, fontSize: 12, fontWeight: "600" },

    outBox: { backgroundColor: theme.outBg, borderColor: theme.outBorder, borderWidth: 1, borderRadius: 12, paddingVertical: 16, paddingHorizontal: 14, marginBottom: 10 },
    outLabel: { color: theme.outLabel, fontSize: 12, marginBottom: 4 },
    outValue: { color: theme.outValue, fontSize: 24, fontWeight: "800", letterSpacing: 0.2 },

    actions: { marginTop: 12 },
    primaryBtn: { borderRadius: 12, overflow: "hidden" },
    gradientLayer: { paddingVertical: 12, alignItems: "center", borderRadius: 12, shadowOpacity: 0.5, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  });

export default getStyles;
