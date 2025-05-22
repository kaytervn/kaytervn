import mongoose from "mongoose";
import StoryView from "../models/storyViewModel.js";
import { formatDistanceToNow } from "../configurations/schemaConfig.js";

const formatStoryViewData = (storyView) => {
  return {
    _id: storyView._id,
    user: {
      _id: storyView.user._id,
      displayName: storyView.user.displayName,
      avatarUrl: storyView.user.avatarUrl,
    },
    story: {
      _id: storyView.story,
    },
    createdAt: formatDistanceToNow(storyView.createdAt),
  };
};

const getListStoryViews = async (req) => {
  const {
    story,
    isPaged,
    page = 0,
    size = isPaged === "0" ? Number.MAX_SAFE_INTEGER : 10,
  } = req.query;

  const offset = parseInt(page, 10) * parseInt(size, 10);
  const limit = parseInt(size, 10);

  let query = {};
  if (mongoose.isValidObjectId(story)) {
    query.story = new mongoose.Types.ObjectId(story);
  }

  const [totalElements, storyViews] = await Promise.all([
    StoryView.countDocuments(query),
    StoryView.find(query)
      .populate("user")
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit),
  ]);

  const totalPages = Math.ceil(totalElements / limit);

  const result = storyViews.map((storyView) => {
    return formatStoryViewData(storyView);
  });

  return {
    content: result,
    totalPages,
    totalElements,
  };
};

export { getListStoryViews };
