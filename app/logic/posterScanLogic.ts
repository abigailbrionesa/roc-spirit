// app/logic/posterScanLogic.ts

export type PosterId = "flowerPoster" | "ghostPoster" | "rockyPoster" | "teacherPoster";

export type PosterScanActions = {
  hasScannedPoster: boolean;
  markPosterScanned: () => void;
  addScore: (points: number) => void;
};

/**
 * This function is the "brain" when a poster is detected.
 * Right now:
 *  - Logs what poster was detected
 *  - Only adds score the first time it's scanned
 */
export const posterScanned = (
  posterId: PosterId,
  actions: PosterScanActions
) => {
  console.log(`[posterScanned] Detected: ${posterId}`);

  if (actions.hasScannedPoster) {
    console.log(
      "[posterScanned] This poster was already scanned, not adding score again."
    );
    return;
  }

  actions.markPosterScanned();
  actions.addScore(5);

  console.log(
    "[posterScanned] Marked poster as scanned and awarded +5 points."
  );
};
