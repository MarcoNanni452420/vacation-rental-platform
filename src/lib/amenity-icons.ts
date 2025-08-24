import type { LucideIcon } from 'lucide-react'
import { 
  Wifi,
  Snowflake, // Aria condizionata
  ChefHat, // Cucina
  UtensilsCrossed, // Lavastoviglie
  WashingMachine, // Lavatrice
  Tv, // TV
  Coffee, // Macchina caffè
  Microwave, // Forno
  Star, // Design esclusivo, marmi pregiati, opere d'arte
  Home, // Travi a vista, pareti in vetro, soffitti storici
  ShowerHead, // Doccia walk-in
  CheckCircle // Default icon
} from 'lucide-react'

// Mappa ottimizzata con solo le icone necessarie
export const amenityIcons: Record<string, LucideIcon> = {
  // Connettività
  "WiFi": Wifi,
  "Wi-fi": Wifi,
  
  // Climatizzazione
  "Aria Condizionata": Snowflake,
  
  // Cucina
  "Cucina Attrezzata": ChefHat,
  "Cucina di design": ChefHat,
  "Lavastoviglie": UtensilsCrossed,
  "Forno": Microwave,
  "Forno moderno": Microwave,
  "Macchina caffè Nespresso": Coffee,
  "Macchina caffè": Coffee,
  
  // Lavanderia
  "Lavatrice/Asciugatrice": WashingMachine,
  "Lavatrice": WashingMachine,
  
  // Intrattenimento
  "TV in ogni stanza": Tv,
  "TV": Tv,
  
  // Caratteristiche speciali
  "Design esclusivo": Star,
  "Marmi pregiati": Star,
  "Opere d'arte": Star,
  "Travi a vista": Home,
  "Pareti in vetro": Home,
  "Soffitti storici": Home,
  
  // Bagno
  "Doccia walk-in": ShowerHead,
}

// Icona di default per amenities non mappate
export const defaultAmenityIcon = CheckCircle