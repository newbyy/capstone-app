import { View, StyleSheet, ScrollView } from 'react-native';
import { Portal, Provider, Text } from 'react-native-paper';  
import { Card, Loading, Modal } from '../components' 
import userStyles from '../styles/user-styles'; 
import services from './services';  
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux'; 
import { supabase } from '../../supabaseConfig';
import { setMessages, setNotificaitons, setUser } from '../../features/userSlice';
import { useEffect } from 'react';
import { setLoadingFalse } from '../../features/uxSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getItemAsync, setItemAsync } from 'expo-secure-store';
import { useCallback } from 'react'; 

export default function HomeScreen() {
  const { session } = useSelector(state => state.user);  
  const { isLoading } = useSelector(state => state.ux)
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // console.log('homescreen check session', session); 
    
  const getMessages = async () => {
    const { data } = await supabase.from('message_channel').select().eq('sender_id', session)
    dispatch(setMessages(data))
  }

  const getNotifications = async() => {
    const { data } = await supabase.from('notification').select().eq('recipent_id', session)
    dispatch(setNotificaitons(data))
  }

  useEffect(() => {
    getMessages();
    getNotifications();
    
  }, [])
 
 
  return ( 
      <Provider> 
        <Portal>
          <Modal  
          />
        </Portal>
        <ScrollView scrollEnabled={!isLoading}>
          {
            isLoading && (<Loading />)
          }
          <Text style={[userStyles.heading, userStyles.textshadow, {marginTop: isLoading ? 50 : 15 }]}>Ligao Laundry</Text>
          <Text style={[userStyles.heading, { fontWeight: '400', fontSize: 18}]}>Bed and Breakfast</Text> 
          <View style={userStyles.hr} />
          {
            services.map((service) => (
              <Card 
                price={service.price}
                desc={service.description}
                key={service.title}
                image={service.image}
                title={service.title}
                subheading={service.subheading}
                blur={service.blurr}
              />
            ))

          }
        </ScrollView> 
      </Provider> 
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: "column"
  }, 
})