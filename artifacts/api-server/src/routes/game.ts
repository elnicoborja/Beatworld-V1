import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { gameSavesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

const router: IRouter = Router();

router.post("/save", async (req, res) => {
  try {
    const {
      playerId,
      playerName,
      currentLevel,
      currentCity,
      completedCities,
      clout,
      character,
      tracks,
    } = req.body;

    if (!playerId || !playerName) {
      res.status(400).json({ error: "playerId and playerName are required" });
      return;
    }

    const existing = await db
      .select()
      .from(gameSavesTable)
      .where(eq(gameSavesTable.playerId, playerId))
      .limit(1);

    let saved;
    if (existing.length > 0) {
      const updated = await db
        .update(gameSavesTable)
        .set({
          playerName,
          currentLevel: currentLevel ?? 1,
          currentCity: currentCity ?? "new_york",
          completedCities: completedCities ?? [],
          clout: clout ?? 0,
          character: character ?? null,
          tracks: tracks ?? null,
          savedAt: new Date(),
        })
        .where(eq(gameSavesTable.playerId, playerId))
        .returning();
      saved = updated[0];
    } else {
      const created = await db
        .insert(gameSavesTable)
        .values({
          id: randomUUID(),
          playerId,
          playerName,
          currentLevel: currentLevel ?? 1,
          currentCity: currentCity ?? "new_york",
          completedCities: completedCities ?? [],
          clout: clout ?? 0,
          character: character ?? null,
          tracks: tracks ?? null,
        })
        .returning();
      saved = created[0];
    }

    res.json({
      id: saved.id,
      playerId: saved.playerId,
      playerName: saved.playerName,
      currentLevel: saved.currentLevel,
      currentCity: saved.currentCity,
      completedCities: saved.completedCities,
      clout: saved.clout,
      character: saved.character,
      tracks: saved.tracks,
      savedAt: saved.savedAt.toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save game" });
  }
});

router.get("/load/:playerId", async (req, res) => {
  try {
    const { playerId } = req.params;

    const saves = await db
      .select()
      .from(gameSavesTable)
      .where(eq(gameSavesTable.playerId, playerId))
      .limit(1);

    if (saves.length === 0) {
      res.status(404).json({ error: "No save found" });
      return;
    }

    const save = saves[0];
    res.json({
      id: save.id,
      playerId: save.playerId,
      playerName: save.playerName,
      currentLevel: save.currentLevel,
      currentCity: save.currentCity,
      completedCities: save.completedCities,
      clout: save.clout,
      character: save.character,
      tracks: save.tracks,
      savedAt: save.savedAt.toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load game" });
  }
});

export default router;
