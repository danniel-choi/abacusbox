import { executeSchedulerRun } from "../functions/_lib/scheduler.js";

const scheduler = {
  async scheduled(controller, env, ctx) {
    const db = env.calcrule;
    if (!db) {
      console.log("Scheduler skipped: D1 binding missing");
      return;
    }

    ctx.waitUntil((async () => {
      const result = await executeSchedulerRun(db, {
        triggerSource: "cron",
        now: new Date(controller.scheduledTime || Date.now())
      });
      console.log(
        JSON.stringify({
          publishedCount: result.publishedCount,
          draftCreated: result.draftCreated,
          draftSlug: result.draftSlug,
          autoPostAction: result.autoPostAction,
          duplicateReason: result.duplicateReason
        })
      );
    })());
  }
};

export default scheduler;
