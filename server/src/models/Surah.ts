import mongoose from 'mongoose';

const ayahSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  arabic: { type: String, required: true },
  translation: { type: String, required: true },
});

const surahSchema = new mongoose.Schema({
  number: { type: Number, required: true, unique: true, index: true },
  arabicName: { type: String, required: true },
  englishName: { type: String, required: true },
  transliteration: { type: String, required: true },
  totalAyahs: { type: Number, required: true },
  revelationType: { type: String, enum: ['Meccan', 'Medinan'], required: true },
  ayahs: [ayahSchema],
});

// Text index on translation for fast search
surahSchema.index({ 'ayahs.translation': 'text' });

export interface IAyah {
  number: number;
  arabic: string;
  translation: string;
}

export interface ISurah {
  number: number;
  arabicName: string;
  englishName: string;
  transliteration: string;
  totalAyahs: number;
  revelationType: string;
  ayahs: IAyah[];
}

const Surah = mongoose.model<ISurah>('Surah', surahSchema);
export default Surah;
