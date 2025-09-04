import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { _aiPrompt, _contentSchedule } from "src/models";
export const getStatsOverviewAIService = async () => {
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
