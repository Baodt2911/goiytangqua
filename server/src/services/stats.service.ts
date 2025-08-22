import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { _aiPrompt } from "src/models";
export const getPromptStatsService = async () => {
  try {
    const total = await _aiPrompt.countDocuments({});
    const active = await _aiPrompt.countDocuments({ status: "active" });
    const paused = await _aiPrompt.countDocuments({ status: "paused" });
    return {
      status: StatusCodes.OK,
      element: {
        total,
        active,
        paused,
      },
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
};
