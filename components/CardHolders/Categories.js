import { View, Text, ScrollView } from 'react-native';

import CategoryCard from '../Cards/CategoryCard';
import SportsBarIcon from '@mui/icons-material/SportsBarRounded';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';
export default function Categories() {
  return (
    <View className="mt-[2%] flex-row justify-center">
      <CategoryCard>
        <SportsBarIcon sx={{ color: '#8500ED' }} />
        <Text className="text-center text-sm text-white">Drinks</Text>
      </CategoryCard>
      <CategoryCard>
        <SlideshowIcon sx={{ color: '#8500ED' }} />
        <Text className="text-center text-sm text-white">Movies/Shows</Text>
      </CategoryCard>
      <CategoryCard>
        <MusicNoteIcon sx={{ color: '#8500ED' }} />
        <Text className="text-center text-sm text-white">Music</Text>
      </CategoryCard>
      <CategoryCard>
        <LocalOfferIcon sx={{ color: '#8500ED' }} />
        <Text className="text-center text-sm text-white">Deals</Text>
      </CategoryCard>
      <CategoryCard>
        <SportsFootballIcon sx={{ color: '#8500ED' }} />
        <Text className="text-center text-sm text-white">Sports</Text>
      </CategoryCard>
    </View>
  );
}
