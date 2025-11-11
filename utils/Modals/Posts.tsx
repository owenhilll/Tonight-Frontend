import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import useAuth from '../../Hooks/authContext';

import {
  Alert,
  FlatList,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { request } from '../axios';
import { useEffect, useState } from 'react';
import Modal from 'react-native-modal';

import { DateSelection } from '../DateTimePicker';
import { Post } from '../Components/Post';
import LoadingIndicator from '../Components/LoadingIndicator';
import DropDownPicker from 'react-native-dropdown-picker';
import { Picker } from '@react-native-picker/picker';

export default function Posts({
  id,
  querystring,
  queryKey,
  profile,
  header,
}: {
  id: string;
  profile: boolean;
  querystring: any | undefined;
  queryKey: string;
  header: string;
}) {
  const { longitude, latitude, user, token, radius } = useAuth();
  const [data, setData] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  const [modifiedHeader, setModifiedHeader] = useState(header);
  useEffect(() => {
    switch (header) {
      case 'Show':
        setModifiedHeader('Shows/Movies');
        break;
      case 'Drink':
        setModifiedHeader('Drinks');
        break;
      case 'Food':
        setModifiedHeader('Food/Meals');
        break;
      case 'Shop':
        setModifiedHeader('Local Shopping Offers');
        break;
      case 'Game':
        setModifiedHeader('Games (non-sporting)');
        break;
      case 'outActivity':
        setModifiedHeader('Outdoor Activities');
        break;
      case 'Classes':
        setModifiedHeader('Classes');
        break;
      case 'Music':
        setModifiedHeader('Concerts and DJs');
        break;
      case 'Sport':
        setModifiedHeader('Sporting Events');
        break;
      default:
        break;
    }
    request
      .get(querystring, {
        params: {
          y: latitude,
          x: longitude,
        },
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        return setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    setDataLoading(false);
  }, [header]);

  const [sortBy, setSortBy] = useState('Views');
  const [open, setOpen] = useState(false);

  return (
    <View className="flex-1">
      <View className="z-50 flex-row items-center">
        <Text className="flex-1 text-3xl text-white">{modifiedHeader}</Text>

        <Text className="mr-2 text-lg text-white">Sort By</Text>

        <DropDownPicker
          open={open}
          placeholder=""
          style={{
            width: 'auto',
            flex: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          containerStyle={{
            width: 'auto',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          setOpen={setOpen}
          items={[
            { label: 'Views', value: 'Views' },
            { label: 'Bookmarks', value: 'Bookmarks' },
          ]}
          multiple={false}
          value={sortBy}
          setValue={setSortBy}
          theme="DARK"
        />
      </View>
      <hr />
      {dataLoading ? (
        <View className="h-[100%]">
          <LoadingIndicator />
        </View>
      ) : data && data.length > 0 ? (
        <View>
          <FlatList
            data={data}
            renderItem={({ item }) => (
              <Post item={item} profile={profile} queryKey={queryKey + 'full'} />
            )}
            keyExtractor={(item) => item.id.toString()}
            initialNumToRender={5}></FlatList>
        </View>
      ) : (
        <View className="flex-1 items-center justify-center">
          {profile ? (
            <Text></Text>
          ) : (
            <View className="">
              <Text className="text-center text-2xl text-white">No events.</Text>
              <Text className="text-center text-sm text-white">
                Try expanding your search radius in home page!
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
