import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useSaveGame } from '@workspace/api-client-react';

export type CharacterSprite = Record<string, string>;

export interface GameState {
  playerId: string;
  playerName: string;
  currentLevel: number;
  currentCity: string | null;
  completedCities: string[];
  clout: number;
  character: CharacterSprite;
  tracks: Record<string, boolean[][]>; // cityId -> track grid
}

interface GameContextType {
  state: GameState;
  updateState: (updates: Partial<GameState>) => void;
  unlockCity: (cityId: string) => void;
  saveTrack: (cityId: string, track: boolean[][]) => void;
  syncToServer: () => void;
}

const defaultState: GameState = {
  playerId: '',
  playerName: 'Producer',
  currentLevel: 1,
  currentCity: null,
  completedCities: [],
  clout: 0,
  character: { skinTone: 'medium', hairStyle: 'fade', hairColor: '#1a0a00', topStyle: 'hoodie', topColor: '#0050ff', pantsStyle: 'baggy', pantsColor: '#111133', accessory: 'headphones' },
  tracks: {},
};

const GameContext = createContext<GameContextType | null>(null);

const STORAGE_KEY = 'beatworld_save';

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse save", e);
      }
    }
    return { ...defaultState, playerId: uuidv4() };
  });

  const { mutate: saveGame } = useSaveGame();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateState = (updates: Partial<GameState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const unlockCity = (cityId: string) => {
    setState((prev) => {
      if (prev.completedCities.includes(cityId)) return prev;
      return {
        ...prev,
        completedCities: [...prev.completedCities, cityId],
        clout: prev.clout + 100, // Bonus clout for finishing
      };
    });
  };

  const saveTrack = (cityId: string, track: boolean[][]) => {
    setState((prev) => ({
      ...prev,
      tracks: { ...prev.tracks, [cityId]: track }
    }));
  };

  const syncToServer = () => {
    saveGame({
      data: {
        playerId: state.playerId,
        playerName: state.playerName,
        currentLevel: state.currentLevel,
        currentCity: state.currentCity || '',
        completedCities: state.completedCities,
        clout: state.clout,
        character: state.character,
        tracks: state.tracks,
      }
    }, {
      onSuccess: () => console.log('Saved to cloud'),
      onError: (e) => console.error('Cloud save failed', e)
    });
  };

  return (
    <GameContext.Provider value={{ state, updateState, unlockCity, saveTrack, syncToServer }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameState() {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGameState must be used within GameProvider");
  return context;
}
