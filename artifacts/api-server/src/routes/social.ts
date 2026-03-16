import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { socialPostsTable, postRatingsTable, gameSavesTable } from "@workspace/db";
import { eq, desc, and, sql } from "drizzle-orm";
import { randomUUID } from "crypto";

const router: IRouter = Router();

router.get("/posts", async (req, res) => {
  try {
    const limit = parseInt(String(req.query.limit ?? "20"));
    const offset = parseInt(String(req.query.offset ?? "0"));

    const posts = await db
      .select()
      .from(socialPostsTable)
      .orderBy(desc(socialPostsTable.createdAt))
      .limit(limit)
      .offset(offset);

    const total = await db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(socialPostsTable);

    res.json({
      posts: posts.map((p) => ({
        id: p.id,
        playerId: p.playerId,
        playerName: p.playerName,
        characterSprite: p.characterSprite,
        city: p.city,
        genre: p.genre,
        trackData: p.trackData,
        screenshot: p.screenshot,
        caption: p.caption,
        cloutRating: p.cloutRating,
        ratingCount: p.ratingCount,
        createdAt: p.createdAt.toISOString(),
      })),
      total: total[0]?.count ?? 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to list posts" });
  }
});

router.post("/posts", async (req, res) => {
  try {
    const { playerId, playerName, characterSprite, city, genre, trackData, screenshot, caption } =
      req.body;

    if (!playerId || !playerName || !city || !genre) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const created = await db
      .insert(socialPostsTable)
      .values({
        id: randomUUID(),
        playerId,
        playerName,
        characterSprite: characterSprite ?? null,
        city,
        genre,
        trackData: trackData ?? null,
        screenshot: screenshot ?? null,
        caption: caption ?? null,
        cloutRating: 0,
        ratingCount: 0,
      })
      .returning();

    const post = created[0];
    res.status(201).json({
      id: post.id,
      playerId: post.playerId,
      playerName: post.playerName,
      characterSprite: post.characterSprite,
      city: post.city,
      genre: post.genre,
      trackData: post.trackData,
      screenshot: post.screenshot,
      caption: post.caption,
      cloutRating: post.cloutRating,
      ratingCount: post.ratingCount,
      createdAt: post.createdAt.toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create post" });
  }
});

router.post("/posts/:postId/rate", async (req, res) => {
  try {
    const { postId } = req.params;
    const { playerId, rating } = req.body;

    if (!playerId || rating == null) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    if (rating < 1 || rating > 5) {
      res.status(400).json({ error: "Rating must be between 1 and 5" });
      return;
    }

    const posts = await db
      .select()
      .from(socialPostsTable)
      .where(eq(socialPostsTable.id, postId))
      .limit(1);

    if (posts.length === 0) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    const existingRating = await db
      .select()
      .from(postRatingsTable)
      .where(and(eq(postRatingsTable.postId, postId), eq(postRatingsTable.playerId, playerId)))
      .limit(1);

    if (existingRating.length > 0) {
      await db
        .update(postRatingsTable)
        .set({ rating })
        .where(eq(postRatingsTable.id, existingRating[0].id));
    } else {
      await db.insert(postRatingsTable).values({
        id: randomUUID(),
        postId,
        playerId,
        rating,
      });
    }

    const allRatings = await db
      .select()
      .from(postRatingsTable)
      .where(eq(postRatingsTable.postId, postId));

    const avgRating = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
    const updated = await db
      .update(socialPostsTable)
      .set({ cloutRating: avgRating, ratingCount: allRatings.length })
      .where(eq(socialPostsTable.id, postId))
      .returning();

    const post = updated[0];

    await db
      .update(gameSavesTable)
      .set({ clout: sql`${gameSavesTable.clout} + 10` })
      .where(eq(gameSavesTable.playerId, post.playerId));

    res.json({
      id: post.id,
      playerId: post.playerId,
      playerName: post.playerName,
      characterSprite: post.characterSprite,
      city: post.city,
      genre: post.genre,
      trackData: post.trackData,
      screenshot: post.screenshot,
      caption: post.caption,
      cloutRating: post.cloutRating,
      ratingCount: post.ratingCount,
      createdAt: post.createdAt.toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to rate post" });
  }
});

router.get("/leaderboard", async (req, res) => {
  try {
    const saves = await db
      .select()
      .from(gameSavesTable)
      .orderBy(desc(gameSavesTable.clout))
      .limit(50);

    res.json({
      entries: saves.map((s) => ({
        playerId: s.playerId,
        playerName: s.playerName,
        characterSprite: (s.character as any)?.sprite ?? null,
        clout: s.clout,
        completedCities: (s.completedCities as string[]).length,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get leaderboard" });
  }
});

export default router;
