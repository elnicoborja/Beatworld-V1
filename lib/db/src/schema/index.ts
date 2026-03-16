import { pgTable, text, integer, real, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const gameSavesTable = pgTable("game_saves", {
  id: text("id").primaryKey(),
  playerId: text("player_id").notNull().unique(),
  playerName: text("player_name").notNull(),
  currentLevel: integer("current_level").notNull().default(1),
  currentCity: text("current_city").notNull().default("new_york"),
  completedCities: jsonb("completed_cities").notNull().$type<string[]>().default([]),
  clout: integer("clout").notNull().default(0),
  character: jsonb("character").$type<Record<string, unknown>>(),
  tracks: jsonb("tracks").$type<Record<string, unknown>>(),
  savedAt: timestamp("saved_at").notNull().defaultNow(),
});

export const insertGameSaveSchema = createInsertSchema(gameSavesTable).omit({ savedAt: true });
export type InsertGameSave = z.infer<typeof insertGameSaveSchema>;
export type GameSave = typeof gameSavesTable.$inferSelect;

export const socialPostsTable = pgTable("social_posts", {
  id: text("id").primaryKey(),
  playerId: text("player_id").notNull(),
  playerName: text("player_name").notNull(),
  characterSprite: text("character_sprite"),
  city: text("city").notNull(),
  genre: text("genre").notNull(),
  trackData: jsonb("track_data").$type<Record<string, unknown>>(),
  screenshot: text("screenshot"),
  caption: text("caption"),
  cloutRating: real("clout_rating").notNull().default(0),
  ratingCount: integer("rating_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSocialPostSchema = createInsertSchema(socialPostsTable).omit({ createdAt: true });
export type InsertSocialPost = z.infer<typeof insertSocialPostSchema>;
export type SocialPost = typeof socialPostsTable.$inferSelect;

export const postRatingsTable = pgTable("post_ratings", {
  id: text("id").primaryKey(),
  postId: text("post_id").notNull(),
  playerId: text("player_id").notNull(),
  rating: real("rating").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertPostRatingSchema = createInsertSchema(postRatingsTable).omit({ createdAt: true });
export type InsertPostRating = z.infer<typeof insertPostRatingSchema>;
export type PostRating = typeof postRatingsTable.$inferSelect;
