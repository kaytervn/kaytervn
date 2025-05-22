import Friendship from "../models/friendshipModel.js";
import Notification from "../models/notificationModel.js";
import Story from "../models/storyModel.js";
import StoryView from "../models/storyViewModel.js";
import {
  isValidObjectId,
  isValidUrl,
  makeErrorResponse,
  makeSuccessResponse,
} from "../services/apiService.js";
import { validateStoriesPerDay } from "../services/settingService.js";
import {
  formatStoryData,
  getGroupStories,
  getListStories,
} from "../services/storyService.js";

const createStory = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const { user } = req;
    const isAllowed = await validateStoriesPerDay(user);
    if (!isAllowed) {
      return makeErrorResponse({
        res,
        message: "Bạn đã đăng đủ bản tin cho hôm nay",
      });
    }
    const story = await Story.create({
      user: user._id,
      imageUrl: isValidUrl(imageUrl) ? imageUrl : null,
    });
    const friendships = await Friendship.find({
      $or: [{ sender: user._id }, { receiver: user._id }],
      status: 2,
    });
    const allFriendNotifications = friendships.map((friendship) => {
      const friendId = friendship.sender.equals(user._id)
        ? friendship.receiver
        : friendship.sender;
      return {
        user: friendId,
        data: {
          user: { _id: user._id },
          story: { _id: story._id },
        },
        message: `${user.displayName} đã đăng bản tin mới`,
      };
    });
    if (allFriendNotifications.length > 0) {
      await Notification.insertMany(allFriendNotifications);
    }
    return makeSuccessResponse({
      res,
      message: "Create story success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const deleteStory = async (req, res) => {
  try {
    const id = req.params.id;
    if (!isValidObjectId(id)) {
      return makeErrorResponse({ res, message: "Invalid id" });
    }
    const story = await Story.findById(id);
    await story.deleteOne();
    return makeSuccessResponse({
      res,
      message: "Delete story success",
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getStory = async (req, res) => {
  try {
    const { id } = req.params;
    const { user: currentUser } = req;
    if (!isValidObjectId(id)) {
      return makeErrorResponse({ res, message: "Invalid id" });
    }
    const story = await Story.findById(id).populate("user");
    if (!story) {
      return makeErrorResponse({ res, message: "Story not found" });
    }
    const groupedStoryList = await getGroupStories(currentUser);
    for (const [groupIndex, group] of groupedStoryList.entries()) {
      const stories = group.stories;
      const storyIndex = stories.findIndex((s) => s.id === story.id);
      if (storyIndex !== -1) {
        const formattedStory = await formatStoryData(story, currentUser);
        let previousStory = null;
        let nextStory = null;
        if (storyIndex > 0) {
          previousStory = stories[storyIndex - 1]._id;
        } else if (groupIndex > 0) {
          const previousGroup = groupedStoryList[groupIndex - 1];
          previousStory = previousGroup.stories[0]._id;
        }
        if (storyIndex < stories.length - 1) {
          nextStory = stories[storyIndex + 1]._id;
        } else if (groupIndex < groupedStoryList.length - 1) {
          const nextGroup = groupedStoryList[groupIndex + 1];
          nextStory = nextGroup.stories[0]._id;
        }
        const storyViewExists = await StoryView.exists({
          user: currentUser._id,
          story: story._id,
        });

        if (!storyViewExists) {
          await StoryView.create({
            user: currentUser._id,
            story: story._id,
          });
        }
        return makeSuccessResponse({
          res,
          data: {
            ...formattedStory,
            position: storyIndex,
            totalStories: stories.length,
            previousStory,
            nextStory,
          },
        });
      }
    }
    return makeErrorResponse({ res, message: "Story not found" });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

const getStories = async (req, res) => {
  try {
    const result = await getListStories(req);
    return makeSuccessResponse({
      res,
      data: result,
    });
  } catch (error) {
    return makeErrorResponse({ res, message: error.message });
  }
};

export { createStory, deleteStory, getStory, getStories };
