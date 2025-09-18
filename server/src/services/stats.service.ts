import { ReasonPhrases, StatusCodes } from "http-status-codes";
import {
  _aiPrompt,
  _contentSchedule,
  _post,
  _user,
  _comment,
  _product,
  _conversation,
} from "src/models";
export const getStatsAIService = async () => {
  try {
    const total_prompt = await _aiPrompt.countDocuments({});
    const active_prompt = await _aiPrompt.countDocuments({
      isActive: true,
    });
    const paused_prompt = await _aiPrompt.countDocuments({
      isActive: false,
    });
    const total_schedule = await _contentSchedule.countDocuments();
    const active_schedule = await _contentSchedule.countDocuments({
      status: "active",
    });
    const paused_schedule = await _contentSchedule.countDocuments({
      status: "paused",
    });
    const completed_schedule = await _contentSchedule.countDocuments({
      status: "completed",
    });
    return {
      status: StatusCodes.OK,
      element: {
        total_prompt,
        active_prompt,
        paused_prompt,
        total_schedule,
        active_schedule,
        paused_schedule,
        completed_schedule,
      },
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
export const getStatsOverviewService = async () => {
  try {
    const total_user = await _user.countDocuments();
    const total_post_featured = await _post.countDocuments({
      isFeatured: true,
    });
    const total_post = await _post.countDocuments();
    const total_comments = await _comment.countDocuments();
    const total_products = await _product.countDocuments();
    const total_conversations = await _conversation.countDocuments();
    return {
      status: StatusCodes.OK,
      element: {
        total_post_featured,
        total_user,
        total_post,
        total_comments,
        total_products,
        total_conversations,
      },
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

export const getStatsPostService = async () => {
  try {
    const postStats = await _post.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $project: { _id: 0, status: "$_id", count: 1 } },
    ]);
    return {
      status: StatusCodes.OK,
      element: postStats,
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

export const getStatsActivitiesService = async () => {
  try {
    const recentUsers = await _user
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email createdAt");
    const recentPosts = await _post
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("author generatedBy createdAt");
    const recentComments = await _comment
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate({ path: "postId", select: "title" });
    const recentProducts = await _product
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name createdAt");

    // Merge và sort theo thời gian
    const activities = [
      ...recentUsers.map((u) => ({
        type: "user",
        data: u,
        time: u.createdAt,
      })),
      ...recentPosts.map((p) => ({
        type: "post",
        data: p,
        time: p.createdAt,
      })),
      ...recentComments.map((c) => ({
        type: "comment",
        data: c,
        time: c.createdAt,
      })),
      ...recentProducts.map((pr) => ({
        type: "product",
        data: pr,
        time: pr.createdAt,
      })),
    ]
      .sort((a: any, b: any) => b.time - a.time)
      .slice(0, 10);
    return {
      status: StatusCodes.OK,
      element: activities,
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};

export const getStatsTopContentService = async () => {
  try {
    const topPosts = await _post.aggregate([
      { $match: { status: "published" } },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "postId",
          as: "comments",
        },
      },
      {
        $addFields: {
          totalInteractions: {
            $add: ["$views", { $size: "$comments" }],
          },
        },
      },
      { $sort: { totalInteractions: -1 } },
      { $limit: 10 },
      {
        $project: {
          title: 1,
          views: 1,
          commentCount: { $size: "$comments" },
          totalInteractions: 1,
        },
      },
    ]);
    return {
      status: StatusCodes.OK,
      element: topPosts,
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
