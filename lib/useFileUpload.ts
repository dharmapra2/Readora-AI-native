import { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { uploadsApi, UploadStatus } from "./apiService";

export type UploadState = "idle" | "picking" | "uploading" | "processing" | "done" | "error";

export function useBookFileUpload(bookId: string) {
  const [state, setState] = useState<UploadState>("idle");
  const [result, setResult] = useState<UploadStatus | null>(null);

  async function pickAndUpload() {
    setState("picking");
    try {
      const picked = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "application/epub+zip"],
        copyToCacheDirectory: true,
      });
      if (picked.canceled || !picked.assets?.[0]) {
        setState("idle");
        return;
      }
      const asset = picked.assets[0];
      setState("uploading");
      const status = await uploadsApi.uploadFile(bookId, asset.uri, asset.mimeType ?? "application/pdf");
      setResult(status);
      setState("processing");

      // Poll until done or error (max 60s)
      let attempts = 0;
      const interval = setInterval(async () => {
        attempts++;
        const chunk = await uploadsApi.getText(bookId, 0, 1).catch(() => null);
        if (chunk?.status === "done") {
          clearInterval(interval);
          setState("done");
        } else if (chunk?.status === "error" || attempts > 30) {
          clearInterval(interval);
          setState("error");
        }
      }, 2000);
    } catch (e: any) {
      Alert.alert("Upload failed", e.message ?? "Please try again.");
      setState("error");
    }
  }

  return { state, result, pickAndUpload };
}

export function useAvatarUpload() {
  const [uploading, setUploading] = useState(false);

  async function pickAvatar(): Promise<string | null> {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission needed", "Please allow photo access to change your avatar.");
      return null;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled || !result.assets?.[0]) return null;
    return result.assets[0].uri;
  }

  return { uploading, pickAvatar };
}
