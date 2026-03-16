export interface Instrument {
  id: string;
  name: string;
  type: 'kick' | 'snare' | 'hihat' | 'perc' | 'bass' | 'lead' | 'chord' | 'arp' | 'pad' | 'fx';
  color: string;
}

export interface CityLevel {
  id: string;
  name: string;
  genre: string;
  level: number;
  numInstruments: number;
  instruments: Instrument[];
  position: [number, number, number];
  venue: string;
  mediaOutlet: string;
  emoji: string;
  defaultBpm?: number;
}

export const CITIES: Record<string, CityLevel> = {
  'new-york': {
    id: 'new-york', name: 'New York', genre: 'Hip Hop', level: 1, numInstruments: 4,
    position: [-3.5, 0, -0.5], venue: 'Madison Square Garden', mediaOutlet: 'XXL Mag', emoji: '🗽',
    instruments: [
      { id: 'kick1', name: '808 Kick', type: 'kick', color: 'bg-red-500' },
      { id: 'snare1', name: 'Snare', type: 'snare', color: 'bg-orange-500' },
      { id: 'hat1', name: 'Hi-Hat', type: 'hihat', color: 'bg-yellow-500' },
      { id: 'bass1', name: 'Sub Bass', type: 'bass', color: 'bg-purple-500' },
    ]
  },
  'los-angeles': {
    id: 'los-angeles', name: 'Los Angeles', genre: 'West Coast Hip Hop', level: 1, numInstruments: 6,
    position: [-4.2, 0, 0.2], venue: 'Crypto.com Arena', mediaOutlet: 'Rolling Stone', emoji: '🌴',
    instruments: [
      { id: 'kick1', name: 'Kick', type: 'kick', color: 'bg-red-500' },
      { id: 'snare1', name: 'Clap', type: 'snare', color: 'bg-orange-500' },
      { id: 'hat1', name: 'Hi-Hat', type: 'hihat', color: 'bg-yellow-500' },
      { id: 'bass1', name: 'G-Funk Bass', type: 'bass', color: 'bg-purple-500' },
      { id: 'lead1', name: 'Sine Lead', type: 'lead', color: 'bg-cyan-400' },
      { id: 'chord1', name: 'Piano', type: 'chord', color: 'bg-blue-500' },
    ]
  },
  'puerto-rico': {
    id: 'puerto-rico', name: 'Puerto Rico', genre: 'Reggaeton', level: 2, numInstruments: 6,
    position: [-2.5, 0, 0.8], venue: 'Coliseo de Puerto Rico', mediaOutlet: 'Billboard Latina', emoji: '🏖️',
    instruments: [
      { id: 'kick1', name: 'Dembow Kick', type: 'kick', color: 'bg-red-500' },
      { id: 'snare1', name: 'Dembow Snare', type: 'snare', color: 'bg-orange-500' },
      { id: 'hat1', name: 'Shaker', type: 'hihat', color: 'bg-yellow-500' },
      { id: 'bass1', name: 'Sub Bass', type: 'bass', color: 'bg-purple-500' },
      { id: 'lead1', name: 'Pluck Synth', type: 'lead', color: 'bg-cyan-400' },
      { id: 'perc1', name: 'Timbal', type: 'perc', color: 'bg-green-500' },
    ]
  },
  'dominican-republic': {
    id: 'dominican-republic', name: 'Santo Domingo', genre: 'Fast Dembow', level: 2, numInstruments: 8,
    position: [-2.2, 0, 0.9], venue: 'Estadio Quisqueya', mediaOutlet: 'Listín Diario Urban', emoji: '🥁',
    instruments: [
      { id: 'kick1', name: 'Boom Kick', type: 'kick', color: 'bg-red-500' },
      { id: 'kick2', name: 'Sub Kick', type: 'kick', color: 'bg-red-700' },
      { id: 'snare1', name: 'Snap', type: 'snare', color: 'bg-orange-500' },
      { id: 'hat1', name: 'Open Hat', type: 'hihat', color: 'bg-yellow-400' },
      { id: 'hat2', name: 'Closed Hat', type: 'hihat', color: 'bg-yellow-600' },
      { id: 'bass1', name: 'Rolling Bass', type: 'bass', color: 'bg-purple-500' },
      { id: 'perc1', name: 'Clave', type: 'perc', color: 'bg-green-500' },
      { id: 'lead1', name: 'Lead Synth', type: 'lead', color: 'bg-cyan-400' },
    ]
  },
  'medellin': {
    id: 'medellin', name: 'Medellín', genre: 'Reggaeton', level: 2, numInstruments: 8,
    position: [-2.0, 0, 1.4], venue: 'Movistar Arena Medellín', mediaOutlet: 'El Colombiano', emoji: '💃',
    instruments: [
      { id: 'kick1', name: 'Dembow Kick', type: 'kick', color: 'bg-red-500' },
      { id: 'snare1', name: 'Clap', type: 'snare', color: 'bg-orange-500' },
      { id: 'hat1', name: 'Hi-Hat', type: 'hihat', color: 'bg-yellow-500' },
      { id: 'bass1', name: 'Bass', type: 'bass', color: 'bg-purple-500' },
      { id: 'lead1', name: 'Melodica', type: 'lead', color: 'bg-cyan-400' },
      { id: 'chord1', name: 'Piano Keys', type: 'chord', color: 'bg-blue-500' },
      { id: 'perc1', name: 'Conga', type: 'perc', color: 'bg-green-500' },
      { id: 'fx1', name: 'Vocal Chop', type: 'fx', color: 'bg-pink-500' },
    ]
  },
  'rio': {
    id: 'rio', name: 'Rio de Janeiro', genre: 'Baile Funk', level: 3, numInstruments: 8,
    position: [-1.2, 0, 2.2], venue: 'Rock in Rio', mediaOutlet: 'Vibe Brasil', emoji: '🎭',
    instruments: [
      { id: 'kick1', name: 'Tambor Kick', type: 'kick', color: 'bg-red-500' },
      { id: 'snare1', name: 'Caixa', type: 'snare', color: 'bg-orange-500' },
      { id: 'hat1', name: 'Hi-Hat', type: 'hihat', color: 'bg-yellow-500' },
      { id: 'perc1', name: 'Tamborim', type: 'perc', color: 'bg-green-400' },
      { id: 'bass1', name: '808 Bass', type: 'bass', color: 'bg-purple-500' },
      { id: 'lead1', name: 'Brass Synth', type: 'lead', color: 'bg-cyan-400' },
      { id: 'fx1', name: 'Vocal Chop', type: 'fx', color: 'bg-pink-500' },
      { id: 'perc2', name: 'Cowbell', type: 'perc', color: 'bg-green-600' },
    ]
  },
  'fortaleza': {
    id: 'fortaleza', name: 'Fortaleza', genre: 'Psytrance', level: 3, numInstruments: 10,
    position: [-0.8, 0, 1.8], venue: 'Cactus Festival', mediaOutlet: 'Mixmag Brasil', emoji: '🌵',
    instruments: [
      { id: 'kick1', name: 'Psy Kick', type: 'kick', color: 'bg-red-500' },
      { id: 'hat1', name: 'Hi-Hat', type: 'hihat', color: 'bg-yellow-500' },
      { id: 'bass1', name: 'Rolling Bass', type: 'bass', color: 'bg-purple-500' },
      { id: 'lead1', name: 'Acid Lead', type: 'lead', color: 'bg-cyan-400' },
      { id: 'arp1', name: 'Arp 16th', type: 'arp', color: 'bg-teal-500' },
      { id: 'pad1', name: 'Atmosphere', type: 'pad', color: 'bg-blue-500' },
      { id: 'fx1', name: 'Sweep FX', type: 'fx', color: 'bg-pink-500' },
      { id: 'lead2', name: 'Psy Lead 2', type: 'lead', color: 'bg-cyan-600' },
      { id: 'perc1', name: 'Tribal Perc', type: 'perc', color: 'bg-green-500' },
      { id: 'bass2', name: 'Sub Bass', type: 'bass', color: 'bg-purple-700' },
    ]
  },
  'sao-paulo': {
    id: 'sao-paulo', name: 'São Paulo', genre: 'Minimal Techno', level: 3, numInstruments: 10,
    position: [-1.0, 0, 2.5], venue: 'D-Edge Club', mediaOutlet: 'Resident Advisor', emoji: '🏙️',
    instruments: [
      { id: 'kick1', name: 'Minimal Kick', type: 'kick', color: 'bg-red-500' },
      { id: 'snare1', name: 'Clap', type: 'snare', color: 'bg-orange-500' },
      { id: 'hat1', name: 'Hi-Hat', type: 'hihat', color: 'bg-yellow-500' },
      { id: 'hat2', name: 'Open Hat', type: 'hihat', color: 'bg-yellow-300' },
      { id: 'bass1', name: 'Bassline', type: 'bass', color: 'bg-purple-500' },
      { id: 'arp1', name: 'Arp', type: 'arp', color: 'bg-teal-500' },
      { id: 'chord1', name: 'Chord Stab', type: 'chord', color: 'bg-indigo-400' },
      { id: 'lead1', name: 'Resonant Lead', type: 'lead', color: 'bg-cyan-400' },
      { id: 'fx1', name: 'Noise Burst', type: 'fx', color: 'bg-pink-500' },
      { id: 'pad1', name: 'Dark Pad', type: 'pad', color: 'bg-blue-500' },
    ]
  },
  'bogota': {
    id: 'bogota', name: 'Bogotá', genre: 'Drum & Bass', level: 4, numInstruments: 10,
    position: [-1.8, 0, 1.2], venue: 'Baum Club', mediaOutlet: 'DJ Mag Colombia', emoji: '🎵',
    instruments: [
      { id: 'kick1', name: 'Punch Kick', type: 'kick', color: 'bg-red-500' },
      { id: 'snare1', name: 'Snare Roll', type: 'snare', color: 'bg-orange-500' },
      { id: 'hat1', name: 'Fast Hat', type: 'hihat', color: 'bg-yellow-400' },
      { id: 'hat2', name: 'Ghost Hat', type: 'hihat', color: 'bg-yellow-600' },
      { id: 'bass1', name: 'Reese Bass', type: 'bass', color: 'bg-purple-500' },
      { id: 'bass2', name: 'Sub Bass', type: 'bass', color: 'bg-purple-700' },
      { id: 'lead1', name: 'Lead Stab', type: 'lead', color: 'bg-cyan-400' },
      { id: 'pad1', name: 'Atmosphere', type: 'pad', color: 'bg-blue-500' },
      { id: 'perc1', name: 'Break Ride', type: 'perc', color: 'bg-green-400' },
      { id: 'fx1', name: 'Vocal Chop', type: 'fx', color: 'bg-pink-500' },
    ]
  },
  'buenos-aires': {
    id: 'buenos-aires', name: 'Buenos Aires', genre: 'Tech House', level: 4, numInstruments: 12,
    position: [-1.5, 0, 3.2], venue: 'Crobar Buenos Aires', mediaOutlet: 'Mixmag Argentina', emoji: '🏠',
    instruments: [
      { id: 'kick1', name: 'House Kick', type: 'kick', color: 'bg-red-500' },
      { id: 'hat1', name: 'Hi-Hat', type: 'hihat', color: 'bg-yellow-400' },
      { id: 'hat2', name: 'Open Hat', type: 'hihat', color: 'bg-yellow-600' },
      { id: 'bass1', name: 'Walking Bass', type: 'bass', color: 'bg-purple-500' },
      { id: 'chord1', name: 'Chord Stab', type: 'chord', color: 'bg-indigo-400' },
      { id: 'fx1', name: 'Vocal Chop', type: 'fx', color: 'bg-pink-500' },
      { id: 'perc1', name: 'Cowbell', type: 'perc', color: 'bg-green-500' },
      { id: 'lead1', name: 'Synth Lead', type: 'lead', color: 'bg-cyan-400' },
      { id: 'snare1', name: 'Clap', type: 'snare', color: 'bg-orange-500' },
      { id: 'arp1', name: 'Arp Loop', type: 'arp', color: 'bg-teal-500' },
      { id: 'pad1', name: 'Pad', type: 'pad', color: 'bg-blue-500' },
      { id: 'perc2', name: 'Shaker', type: 'perc', color: 'bg-green-700' },
    ]
  },
  'santiago': {
    id: 'santiago', name: 'Santiago de Chile', genre: 'Trap', level: 4, numInstruments: 12,
    position: [-1.7, 0, 3.5], venue: 'Movistar Arena Santiago', mediaOutlet: 'El Mercurio Hip Hop', emoji: '🎤',
    instruments: [
      { id: 'kick1', name: '808', type: 'kick', color: 'bg-red-500' },
      { id: 'hat1', name: 'Triplet Hat', type: 'hihat', color: 'bg-yellow-400' },
      { id: 'hat2', name: 'Open Hat', type: 'hihat', color: 'bg-yellow-600' },
      { id: 'snare1', name: 'Snare', type: 'snare', color: 'bg-orange-500' },
      { id: 'lead1', name: 'Melody', type: 'lead', color: 'bg-cyan-400' },
      { id: 'lead2', name: 'Bells', type: 'lead', color: 'bg-cyan-600' },
      { id: 'fx1', name: 'Vocal Ad-lib', type: 'fx', color: 'bg-pink-500' },
      { id: 'bass1', name: 'Sub 808', type: 'bass', color: 'bg-purple-500' },
      { id: 'chord1', name: 'Brass Stab', type: 'chord', color: 'bg-indigo-400' },
      { id: 'pad1', name: 'Pad', type: 'pad', color: 'bg-blue-500' },
      { id: 'perc1', name: 'Perc', type: 'perc', color: 'bg-green-500' },
      { id: 'arp1', name: 'Arp Keys', type: 'arp', color: 'bg-teal-500' },
    ]
  },
  'mexico-city': {
    id: 'mexico-city', name: 'Mexico City', genre: 'Cumbia', level: 5, numInstruments: 12,
    position: [-3.2, 0, 0.8], venue: 'Foro Sol', mediaOutlet: 'Revolver Mag MX', emoji: '🌮',
    instruments: [
      { id: 'kick1', name: 'Caja', type: 'kick', color: 'bg-red-500' },
      { id: 'perc1', name: 'Guacharaca', type: 'perc', color: 'bg-green-400' },
      { id: 'bass1', name: 'Bajo Electrico', type: 'bass', color: 'bg-purple-500' },
      { id: 'lead1', name: 'Accordion', type: 'lead', color: 'bg-cyan-400' },
      { id: 'chord1', name: 'Trumpet', type: 'chord', color: 'bg-indigo-400' },
      { id: 'perc2', name: 'Conga', type: 'perc', color: 'bg-green-600' },
      { id: 'lead2', name: 'Marimba', type: 'lead', color: 'bg-teal-400' },
      { id: 'fx1', name: 'Vocal', type: 'fx', color: 'bg-pink-500' },
      { id: 'hat1', name: 'Hi-Hat', type: 'hihat', color: 'bg-yellow-500' },
      { id: 'snare1', name: 'Snare', type: 'snare', color: 'bg-orange-500' },
      { id: 'pad1', name: 'String Pad', type: 'pad', color: 'bg-blue-500' },
      { id: 'perc3', name: 'Woodblock', type: 'perc', color: 'bg-green-700' },
    ]
  },
  'monterrey': {
    id: 'monterrey', name: 'Monterrey', genre: 'Tribal', level: 5, numInstruments: 14,
    position: [-3.4, 0, 0.5], venue: 'Arena Monterrey', mediaOutlet: 'DJ Mag Mexico', emoji: '🪘',
    instruments: [
      { id: 'kick1', name: 'Tribal Kick', type: 'kick', color: 'bg-red-500' },
      { id: 'kick2', name: 'Bass Drum', type: 'kick', color: 'bg-red-700' },
      { id: 'perc1', name: 'Tribal Perc', type: 'perc', color: 'bg-green-400' },
      { id: 'perc2', name: 'Maraca', type: 'perc', color: 'bg-green-600' },
      { id: 'fx1', name: 'Whistle', type: 'fx', color: 'bg-pink-500' },
      { id: 'lead1', name: 'Synth Lead', type: 'lead', color: 'bg-cyan-400' },
      { id: 'bass1', name: 'Deep Bass', type: 'bass', color: 'bg-purple-500' },
      { id: 'hat1', name: 'Hi-Hat', type: 'hihat', color: 'bg-yellow-400' },
      { id: 'hat2', name: 'Open Hat', type: 'hihat', color: 'bg-yellow-600' },
      { id: 'perc3', name: 'Congas', type: 'perc', color: 'bg-green-700' },
      { id: 'chord1', name: 'Stab', type: 'chord', color: 'bg-indigo-400' },
      { id: 'arp1', name: 'Arp', type: 'arp', color: 'bg-teal-500' },
      { id: 'pad1', name: 'Dark Pad', type: 'pad', color: 'bg-blue-500' },
      { id: 'fx2', name: 'FX Sweep', type: 'fx', color: 'bg-pink-700' },
    ]
  },
  'tulum': {
    id: 'tulum', name: 'Tulum', genre: 'Organic House', level: 5, numInstruments: 14,
    position: [-2.8, 0, 0.6], venue: 'Papaya Playa Project', mediaOutlet: 'Electronic Beats', emoji: '🌿',
    instruments: [
      { id: 'kick1', name: 'Hand Drum', type: 'kick', color: 'bg-red-500' },
      { id: 'bass1', name: 'Deep Bass', type: 'bass', color: 'bg-purple-500' },
      { id: 'lead1', name: 'Marimba', type: 'lead', color: 'bg-cyan-400' },
      { id: 'lead2', name: 'Pan Flute', type: 'lead', color: 'bg-cyan-600' },
      { id: 'fx1', name: 'Vocal', type: 'fx', color: 'bg-pink-500' },
      { id: 'chord1', name: 'Acoustic Guitar', type: 'chord', color: 'bg-indigo-400' },
      { id: 'pad1', name: 'Ambient Pad', type: 'pad', color: 'bg-blue-500' },
      { id: 'perc1', name: 'Shaker', type: 'perc', color: 'bg-green-500' },
      { id: 'perc2', name: 'Tabla', type: 'perc', color: 'bg-green-600' },
      { id: 'hat1', name: 'Hi-Hat', type: 'hihat', color: 'bg-yellow-400' },
      { id: 'snare1', name: 'Snare', type: 'snare', color: 'bg-orange-500' },
      { id: 'arp1', name: 'Piano Arp', type: 'arp', color: 'bg-teal-500' },
      { id: 'perc3', name: 'Djembe', type: 'perc', color: 'bg-green-700' },
      { id: 'fx2', name: 'Nature FX', type: 'fx', color: 'bg-pink-700' },
    ]
  },
  'berlin': {
    id: 'berlin', name: 'Berlin', genre: 'Techno', level: 6, numInstruments: 14,
    position: [2.0, 0, -1.2], venue: 'Berghain', mediaOutlet: 'Groove Magazine', emoji: '⚡',
    instruments: [
      { id: 'kick1', name: 'Deep Kick', type: 'kick', color: 'bg-red-500' },
      { id: 'kick2', name: 'Rumble Kick', type: 'kick', color: 'bg-red-700' },
      { id: 'snare1', name: 'Clap', type: 'snare', color: 'bg-orange-500' },
      { id: 'hat1', name: 'Open Hat', type: 'hihat', color: 'bg-yellow-400' },
      { id: 'hat2', name: 'Closed Hat', type: 'hihat', color: 'bg-yellow-600' },
      { id: 'perc1', name: 'Tom', type: 'perc', color: 'bg-green-500' },
      { id: 'bass1', name: 'Rolling Bass', type: 'bass', color: 'bg-purple-500' },
      { id: 'lead1', name: 'Acid Lead', type: 'lead', color: 'bg-cyan-400' },
      { id: 'lead2', name: 'Industrial Synth', type: 'lead', color: 'bg-cyan-600' },
      { id: 'pad1', name: 'Dark Pad', type: 'pad', color: 'bg-blue-500' },
      { id: 'chord1', name: 'Minor Chord', type: 'chord', color: 'bg-indigo-500' },
      { id: 'fx1', name: 'Noise Sweep', type: 'fx', color: 'bg-pink-500' },
      { id: 'fx2', name: 'Impact', type: 'fx', color: 'bg-pink-700' },
      { id: 'arp1', name: '16th Arp', type: 'arp', color: 'bg-teal-400' },
    ]
  },
  'london': {
    id: 'london', name: 'London', genre: 'Drum and Bass', level: 6, numInstruments: 14,
    position: [1.5, 0, -1.5], venue: 'Fabric London', mediaOutlet: 'DJ Mag UK', emoji: '🇬🇧',
    instruments: [
      { id: 'kick1', name: 'Punch Kick', type: 'kick', color: 'bg-red-500' },
      { id: 'snare1', name: 'Tight Snare', type: 'snare', color: 'bg-orange-500' },
      { id: 'hat1', name: 'Fast Hat 1', type: 'hihat', color: 'bg-yellow-400' },
      { id: 'hat2', name: 'Fast Hat 2', type: 'hihat', color: 'bg-yellow-600' },
      { id: 'perc1', name: 'Break Ride', type: 'perc', color: 'bg-green-400' },
      { id: 'perc2', name: 'Ghost Snare', type: 'perc', color: 'bg-green-600' },
      { id: 'bass1', name: 'Reese Bass', type: 'bass', color: 'bg-purple-500' },
      { id: 'bass2', name: 'Sub Bass', type: 'bass', color: 'bg-purple-700' },
      { id: 'lead1', name: 'Dark Lead', type: 'lead', color: 'bg-cyan-400' },
      { id: 'pad1', name: 'Atmosphere', type: 'pad', color: 'bg-blue-500' },
      { id: 'chord1', name: 'Stab', type: 'chord', color: 'bg-indigo-400' },
      { id: 'fx1', name: 'Sweep Up', type: 'fx', color: 'bg-pink-500' },
      { id: 'fx2', name: 'Vocal Hit', type: 'fx', color: 'bg-pink-700' },
      { id: 'arp1', name: 'Arp', type: 'arp', color: 'bg-teal-400' },
    ]
  },
  'newcastle': {
    id: 'newcastle', name: 'Newcastle', genre: 'Jungle', level: 6, numInstruments: 16,
    position: [1.7, 0, -1.7], venue: 'Digital Newcastle', mediaOutlet: 'Juno Records Blog', emoji: '🌿',
    instruments: [
      { id: 'kick1', name: 'Amen Kick', type: 'kick', color: 'bg-red-500' },
      { id: 'snare1', name: 'Amen Snare', type: 'snare', color: 'bg-orange-500' },
      { id: 'hat1', name: 'Hat', type: 'hihat', color: 'bg-yellow-400' },
      { id: 'hat2', name: 'Open Hat', type: 'hihat', color: 'bg-yellow-600' },
      { id: 'perc1', name: 'Ride', type: 'perc', color: 'bg-green-400' },
      { id: 'perc2', name: 'Ghost', type: 'perc', color: 'bg-green-600' },
      { id: 'bass1', name: 'Bassline', type: 'bass', color: 'bg-purple-500' },
      { id: 'bass2', name: 'Sub Bass', type: 'bass', color: 'bg-purple-700' },
      { id: 'lead1', name: 'Organ', type: 'lead', color: 'bg-cyan-400' },
      { id: 'chord1', name: 'Stab', type: 'chord', color: 'bg-indigo-400' },
      { id: 'fx1', name: 'Vocal', type: 'fx', color: 'bg-pink-500' },
      { id: 'fx2', name: 'FX', type: 'fx', color: 'bg-pink-700' },
      { id: 'pad1', name: 'Pad', type: 'pad', color: 'bg-blue-500' },
      { id: 'arp1', name: 'Arp', type: 'arp', color: 'bg-teal-400' },
      { id: 'perc3', name: 'Jungle Perc', type: 'perc', color: 'bg-green-700' },
      { id: 'lead2', name: 'Synth 2', type: 'lead', color: 'bg-cyan-600' },
    ]
  },
  'brighton': {
    id: 'brighton', name: 'Brighton', genre: 'Broken Beat', level: 6, numInstruments: 16,
    position: [1.6, 0, -1.4], venue: 'Patterns Brighton', mediaOutlet: 'Wire Magazine', emoji: '🎼',
    instruments: [
      { id: 'kick1', name: 'Congas L', type: 'kick', color: 'bg-red-500' },
      { id: 'kick2', name: 'Congas R', type: 'kick', color: 'bg-red-700' },
      { id: 'snare1', name: 'Snare', type: 'snare', color: 'bg-orange-500' },
      { id: 'snare2', name: 'Ghost Snare', type: 'snare', color: 'bg-orange-700' },
      { id: 'hat1', name: 'Hi-Hat', type: 'hihat', color: 'bg-yellow-400' },
      { id: 'hat2', name: 'Open Hat', type: 'hihat', color: 'bg-yellow-600' },
      { id: 'bass1', name: 'Electric Bass', type: 'bass', color: 'bg-purple-500' },
      { id: 'bass2', name: 'Sub Bass', type: 'bass', color: 'bg-purple-700' },
      { id: 'chord1', name: 'Rhodes Piano', type: 'chord', color: 'bg-indigo-400' },
      { id: 'chord2', name: 'Guitar', type: 'chord', color: 'bg-indigo-600' },
      { id: 'lead1', name: 'Flute', type: 'lead', color: 'bg-cyan-400' },
      { id: 'fx1', name: 'Vocal', type: 'fx', color: 'bg-pink-500' },
      { id: 'chord3', name: 'Brass', type: 'chord', color: 'bg-indigo-700' },
      { id: 'pad1', name: 'Synth Pad', type: 'pad', color: 'bg-blue-500' },
      { id: 'perc1', name: 'Shaker', type: 'perc', color: 'bg-green-500' },
      { id: 'arp1', name: 'Vibraphone', type: 'arp', color: 'bg-teal-400' },
    ]
  },
};

export const CITIES_LIST = Object.values(CITIES).sort((a, b) => a.level - b.level);

export const LEVEL_NAMES: Record<number, string> = {
  1: 'LEVEL 1 - HIP HOP USA',
  2: 'LEVEL 2 - LATIN CARIBBEAN',
  3: 'LEVEL 3 - SOUTH AMERICAN BEATS',
  4: 'LEVEL 4 - ANDEAN SOUTH AMERICA',
  5: 'LEVEL 5 - MEXICO VIBES',
  6: 'FINAL LEVEL - EUROPEAN UNDERGROUND',
};
