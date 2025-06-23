import { motion } from "framer-motion";
import { CrownIcon, Trash2Icon, UserIcon, UserPlusIcon } from "lucide-react";
import { getMediaImage, getNestedValue } from "../../../services/utils";
import { ModalForm } from "../../../components/form/FormCard";
import { SETTING_KEYS } from "../../../services/constant";

const MemberList = ({
  members,
  onRemoveMember,
  onInviteMember,
  settings,
}: any) => {
  const allowInvite = getNestedValue(
    settings,
    SETTING_KEYS.ALLOW_INVITE_MEMBERS
  );
  const ownerPermission = settings.isOwner;

  return (
    <div className="space-y-4">
      {allowInvite && (
        <div className="flex justify-end mb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onInviteMember}
            className="flex items-center space-x-2 bg-blue-600/80 text-white px-3 py-2 rounded-lg hover:bg-blue-600/90 transition-colors"
          >
            <UserPlusIcon size={16} />
            <span className="text-sm">Mời thành viên</span>
          </motion.button>
        </div>
      )}

      <div className="space-y-2">
        {members.map((memberItem: any) => {
          const { id, member, isOwner, isYou } = memberItem;

          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3 hover:bg-gray-800/60 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-700 border border-gray-600 flex items-center justify-center overflow-hidden relative">
                  {member.avatarPath ? (
                    <img
                      src={getMediaImage(member.avatarPath)}
                      alt={member.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon size={16} className="text-gray-300" />
                  )}
                </div>

                <div>
                  <p className="text-sm text-gray-200 flex items-center space-x-2">
                    <span>{member.fullName}</span>
                    {isOwner && (
                      <div className="text-yellow-500" title="Chủ phòng">
                        <CrownIcon size={14} />
                      </div>
                    )}
                    {isYou && (
                      <span className="text-xs text-gray-400">(Bạn)</span>
                    )}
                  </p>
                </div>
              </div>

              {ownerPermission && !(isYou || isOwner) && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onRemoveMember(id)}
                  className="text-red-500 hover:bg-red-500/10 p-2 rounded-full transition-colors"
                  title="Xóa thành viên"
                >
                  <Trash2Icon size={16} />
                </motion.button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const ChatRoomMembers = ({ isVisible, formConfig }: any) => {
  if (!isVisible) return null;
  return (
    <>
      <ModalForm
        isVisible={isVisible}
        onClose={formConfig?.hideModal}
        title={formConfig?.title}
        children={
          <>
            <MemberList
              members={formConfig?.members}
              settings={formConfig?.settings}
              onRemoveMember={formConfig?.onRemoveMember}
              onInviteMember={formConfig?.onInviteMember}
            />
          </>
        }
      />
    </>
  );
};

export default ChatRoomMembers;
