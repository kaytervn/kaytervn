import { useMemo } from "react";
import { ModalForm } from "../../../components/form/FormCard";
import { motion } from "framer-motion";
import { getMediaImage } from "../../../services/utils";
import { MESSAGE_REACTION_KIND_MAP } from "../../../components/config/PageConfig";
import { UserIcon } from "lucide-react";

const MessageReactionsList = ({ messageReactions }: any) => {
  const groupedReactions = useMemo(() => {
    if (!messageReactions?.length) return [];

    const grouped: any = {};
    messageReactions.forEach((reaction: any) => {
      const reactionKey = reaction.kind;
      if (!grouped[reactionKey]) {
        grouped[reactionKey] = [];
      }
      grouped[reactionKey].push(reaction);
    });

    return Object.entries(grouped)
      .map(([kind, reactions]: any) => ({
        kind,
        reactions,
        count: reactions.length,
        reactionInfo: Object.values(MESSAGE_REACTION_KIND_MAP).find(
          (r) => r.value == kind
        ),
      }))
      .sort((a, b) => b.count - a.count);
  }, [messageReactions, MESSAGE_REACTION_KIND_MAP]);

  if (!messageReactions?.length) {
    return (
      <div className="text-gray-400 text-sm text-center py-4">
        Chưa có phản ứng
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groupedReactions.map(({ kind, reactions, count, reactionInfo }: any) => (
        <motion.div
          key={kind}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-gray-800/50 rounded-lg p-3"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{reactionInfo?.emoji}</span>
              <span className="text-sm text-gray-300">
                {reactionInfo?.label}
              </span>
            </div>
            <span className="text-xs text-gray-400 font-medium">
              {count} {count === 1 ? "người" : "người"}
            </span>
          </div>

          <div className="flex flex-1 border-b mb-2 border-gray-700" />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {reactions?.map((reaction: any) => (
              <div
                key={reaction.id}
                className="flex items-center space-x-2 p-1.5 rounded-md hover:bg-gray-800/30 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center overflow-hidden">
                  {reaction.account.avatarPath ? (
                    <img
                      src={getMediaImage(reaction.account.avatarPath)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon size={16} className="text-gray-300" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-200 whitespace-nowrap">
                    {reaction.account.fullName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const MemberReactions = ({ isVisible, formConfig }: any) => {
  if (!isVisible) return null;
  return (
    <>
      <ModalForm
        isVisible={isVisible}
        onClose={formConfig.hideModal}
        title={formConfig.title}
        children={
          <>
            <MessageReactionsList
              messageReactions={formConfig?.messageReactions}
            />
          </>
        }
      />
    </>
  );
};

export default MemberReactions;
