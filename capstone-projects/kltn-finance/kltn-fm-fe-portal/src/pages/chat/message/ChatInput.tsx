import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PaperclipIcon,
  SmileIcon,
  SendIcon,
  XIcon,
  Loader2Icon,
} from "lucide-react";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { ParentMessage } from "./MessageComponents";
import {
  decryptData,
  encryptAES,
  generateIdNumber,
  getCurrentDate,
  getMimeType,
  getNestedValue,
  truncateString,
} from "../../../services/utils";
import {
  BASIC_MESSAGES,
  CHAT_HISTORY_ROLE,
  SETTING_KEYS,
  TOAST,
} from "../../../services/constant";
import {
  DECRYPT_FIELDS,
  GEMINI_BOT_CONFIG,
} from "../../../components/config/PageConfig";
import { useGlobalContext } from "../../../components/config/GlobalProvider";
import { FileTypeIcon } from "../FileComponents";

const ChatInput = ({
  loadingMessageList,
  selectedConversation,
  newMessage,
  setNewMessage,
  setMessages,
  scrollToBottom,
  fetchChatHistoryListNoLoading,
  parentMessage,
  setParentMessage,
  chatHistorySendMsgApi,
  sendMessageApi,
  mediaApi,
  resetChatInputForm,
  loadingSendMessage,
  onClickParentMessage,
  openModal,
  settings,
}: any) => {
  const allowSendMessage = getNestedValue(
    settings,
    SETTING_KEYS.ALLOW_SEND_MESSAGES
  );
  const { setToast, sessionKey } = useGlobalContext();
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const res = await mediaApi.upload(file);
    const filePath = res.data.filePath;
    if (filePath) {
      const newFile = { name: file.name, url: filePath };
      const newUpdatedFiles = [...uploadedFiles, newFile];
      setUploadedFiles(newUpdatedFiles);
      setToast("Tệp đã được tải lên thành công", TOAST.SUCCESS);
    } else {
      setToast("Lỗi khi tải tệp lên", TOAST.ERROR);
    }
  };

  const deleteFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEmojiSelect = (emoji: any) => {
    const textarea = textareaRef?.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = newMessage;
    const newText = text.slice(0, start) + emoji.native + text.slice(end);
    setNewMessage(newText);

    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd =
        start + emoji.native.length;
      textarea.focus();
    }, 0);
    setShowEmojiPicker(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      setInputFocused(false);
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (isLoading || !allowSendMessage) {
      return;
    }
    if (selectedConversation?.kind === GEMINI_BOT_CONFIG.kind) {
      if (!newMessage.trim()) {
        setToast("Vui lòng nhập tin nhắn", TOAST.ERROR);
        return;
      }
      const msgObj = {
        id: generateIdNumber(),
        role: CHAT_HISTORY_ROLE.USER,
        message: newMessage,
        createdDate: getCurrentDate(),
      };
      setMessages((prev: any) => [...prev, msgObj]);
      setTimeout(() => scrollToBottom(), 800);
      const res = await chatHistorySendMsgApi.create({
        message: encryptAES(newMessage, sessionKey),
      });
      if (!res.result) {
        setToast(BASIC_MESSAGES.FAILED, TOAST.ERROR);
      }
      await fetchChatHistoryListNoLoading();
    } else {
      if (!newMessage.trim() && uploadedFiles?.length == 0) {
        setToast("Vui lòng nhập tin nhắn hoặc gửi tệp", TOAST.ERROR);
        return;
      }
      const document = uploadedFiles?.length
        ? JSON.stringify(
            uploadedFiles.map((file) => ({
              name: file.name,
              url: file.url,
            }))
          )
        : null;
      const res = await sendMessageApi.create({
        chatRoomId: selectedConversation?.id,
        content: newMessage ? encryptAES(newMessage, sessionKey) : null,
        document: document ? encryptAES(document, sessionKey) : null,
        parentMessageId: parentMessage?.id || null,
      });
      setMessages((prev: any) => [
        ...prev,
        decryptData(sessionKey, res?.data, DECRYPT_FIELDS.MESSAGE),
      ]);
    }
    resetChatInputForm();
    setUploadedFiles([]);
  };

  const isLoading = loadingMessageList || loadingSendMessage;

  return (
    <div className="p-4 border-t border-gray-700/50 bg-gray-800/30 backdrop-blur-md">
      {!allowSendMessage ? (
        <div className="text-center text-red-400 py-2">
          Chỉ trưởng nhóm mới có thể gửi tin nhắn trong cuộc trò chuyện này
        </div>
      ) : (
        <>
          {parentMessage && (
            <div className="mb-3 relative">
              <ParentMessage
                parent={parentMessage}
                onClick={onClickParentMessage}
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setParentMessage(null)}
                className="absolute top-1 right-1 p-1 rounded-full hover:bg-gray-700/50 text-gray-400 hover:text-white"
                aria-label="Hủy trả lời"
              >
                <XIcon size={16} />
              </motion.button>
            </div>
          )}
          <div className="flex items-center space-x-3">
            {selectedConversation.kind !== GEMINI_BOT_CONFIG.kind && (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-2 rounded-full hover:bg-gray-700/50 transition-all ${
                    isLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "text-gray-400 hover:text-white"
                  }`}
                  disabled={isLoading}
                  aria-label="Đính kèm tệp"
                >
                  <PaperclipIcon size={20} />
                </motion.button>
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isLoading}
                />
              </>
            )}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                className={`p-2 rounded-full hover:bg-gray-700/50 transition-all ${
                  isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "text-gray-400 hover:text-white"
                }`}
                disabled={isLoading}
                aria-label="Chọn biểu cảm"
              >
                <SmileIcon size={20} />
              </motion.button>
              <AnimatePresence>
                {showEmojiPicker && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    ref={emojiPickerRef}
                    className="absolute bottom-12 left-0 z-[100] bg-gray-800/90 rounded-lg shadow-lg border border-gray-700/50"
                  >
                    <Picker
                      data={data}
                      onEmojiSelect={handleEmojiSelect}
                      theme="dark"
                      locale="vi"
                      previewPosition="none"
                      emojiSize={24}
                      perLine={8}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              placeholder="Nhập tin nhắn..."
              className={`flex-1 p-3 bg-gray-700/50 border border-gray-600/30 rounded-xl text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none transition-all ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              rows={inputFocused || newMessage.length > 50 ? 3 : 1}
              disabled={isLoading}
            />
            <motion.button
              whileHover={{ scale: isLoading ? 1 : 1.1 }}
              whileTap={{ scale: isLoading ? 1 : 0.9 }}
              onClick={handleSendMessage}
              className={`p-3 rounded-full shadow-md transition-all ${
                isLoading
                  ? "bg-gray-600/50 cursor-not-allowed"
                  : "bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
              }`}
              disabled={isLoading}
              aria-label={isLoading ? "Đang xử lý..." : "Gửi tin nhắn"}
            >
              {isLoading ? (
                <Loader2Icon size={20} className="animate-spin" />
              ) : (
                <SendIcon size={20} />
              )}
            </motion.button>
          </div>
          {uploadedFiles.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {uploadedFiles.map((file, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, cursor: "pointer" }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => openModal(file)}
                  className="flex items-center space-x-2 bg-gray-700/50 rounded-lg p-2 border border-gray-600/30 hover:bg-gray-600/70"
                >
                  <FileTypeIcon mimeType={getMimeType(file.name)} />
                  <span className="text-sm text-gray-200 truncate max-w-[150px] group-hover:text-white">
                    {truncateString(file.name, 20)}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFile(index);
                    }}
                    className="p-1 rounded-full hover:bg-gray-600/50 text-gray-400 hover:text-white"
                    aria-label={`Xóa tệp ${file.name}`}
                  >
                    <XIcon size={16} />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChatInput;
