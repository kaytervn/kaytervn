import Friendship from "../models/friendshipModel.js";
import { formatDistanceToNow } from "../configurations/schemaConfig.js";
import StoryView from "../models/storyViewModel.js";
import Story from "../models/storyModel.js";

const formatStoryData = async (story, currentUser) => {
  const views = await StoryView.find({ story: story._id });
  story.isOwner = story.user._id.equals(currentUser._id) ? 1 : 0;
  story.totalViews = views.length;
  story.isViewed = (await StoryView.exists({
    user: currentUser._id,
    story: story._id,
  }))
    ? 1
    : 0;
  return {
    _id: story._id,
    imageUrl: story.imageUrl,
    user: {
      _id: story.user._id,
      displayName: story.user.displayName,
      avatarUrl: story.user.avatarUrl,
    },
    createdAt: formatDistanceToNow(story.createdAt),
    isViewed: story.isViewed,
    isOwner: story.isOwner,
    totalViews: story.totalViews,
  };
};

const getListStories = async (req) => {
  const {
    isPaged,
    page = 0,
    size = isPaged === "0" ? Number.MAX_SAFE_INTEGER : 10,
  } = req.query;
  const currentUser = req.user;

  const offset = parseInt(page, 10) * parseInt(size, 10);
  const limit = parseInt(size, 10);

  const groupedStoryList = await getGroupStories(currentUser);
  const pagedGroupStories = groupedStoryList.slice(offset, offset + limit);
  const totalPages = Math.ceil(groupedStoryList.length / limit);

  const result = await Promise.all(
    pagedGroupStories.map(async (group, groupIndex) => {
      return formattedGroupStory(
        pagedGroupStories,
        group,
        groupIndex,
        currentUser
      );
    })
  );

  return {
    content: result,
    totalPages,
    totalElements: groupedStoryList.length,
  };
};

const formattedGroupStory = async (
  groupedStories,
  group,
  groupIndex,
  currentUser
) => {
  const stories = group.stories;
  const formattedStory = await formatStoryData(group.latestStory, currentUser);
  const index = stories.findIndex((s) => s.id === group.latestStory.id);
  let previousStory = null;
  let nextStory = null;
  if (index > 0) {
    previousStory = stories[index - 1]._id;
  } else if (groupIndex > 0) {
    const previousGroup = groupedStories[groupIndex - 1];
    previousStory = previousGroup.stories[0]._id;
  }
  if (index < stories.length - 1) {
    nextStory = stories[index + 1]._id;
  } else if (groupIndex < groupedStories.length - 1) {
    const nextGroup = groupedStories[groupIndex + 1];
    nextStory = nextGroup.stories[0]._id;
  }
  return {
    ...formattedStory,
    position: index,
    totalStories: stories.length,
    previousStory,
    nextStory,
  };
};

const getGroupStories = async (currentUser) => {
  const friendships = await Friendship.find({
    $or: [{ sender: currentUser._id }, { receiver: currentUser._id }],
    status: 2,
  });

  const friendIds = friendships.map((friendship) =>
    friendship.sender.equals(currentUser._id)
      ? friendship.receiver
      : friendship.sender
  );

  let query = { user: { $in: [...friendIds, currentUser._id] } };
  const stories = await Story.find(query)
    .populate("user")
    .sort({ createdAt: 1 });
  const viewedStoryIds = new Set(
    (await StoryView.find({ user: currentUser._id }).distinct("story")).map(
      String
    )
  );
  const groupedStories = {};
  for (const story of stories) {
    const userId = story.user._id.toString();
    if (!groupedStories[userId]) {
      groupedStories[userId] = {
        user: story.user,
        latestStory: null,
        stories: [],
        isOwner: story.user._id.equals(currentUser._id),
        hasUnviewed: false,
      };
    }
    groupedStories[userId].stories.push(story);
    const isViewed = viewedStoryIds.has(story._id.toString());
    if (!isViewed) {
      if (!groupedStories[userId].latestStory) {
        groupedStories[userId].latestStory = story;
      }
      if (!groupedStories[userId].hasUnviewed) {
        groupedStories[userId].hasUnviewed = true;
      }
    }
    const totalStories = await Story.countDocuments({ user: userId });
    if (
      groupedStories[userId].stories.length === totalStories &&
      !groupedStories[userId].latestStory
    ) {
      groupedStories[userId].latestStory = story;
    }
  }
  const groupedStoriesArray = Object.values(groupedStories);
  groupedStoriesArray.sort((a, b) => {
    if (a.isOwner !== b.isOwner) return a.isOwner ? -1 : 1;
    if (a.hasUnviewed !== b.hasUnviewed) return a.hasUnviewed ? -1 : 1;
    return (
      new Date(b.latestStory.createdAt) - new Date(a.latestStory.createdAt)
    );
  });
  return groupedStoriesArray;
};

export {
  formatStoryData,
  getListStories,
  getGroupStories,
  formattedGroupStory,
};
