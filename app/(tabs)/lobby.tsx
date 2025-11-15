import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';
import { Alert } from 'react-native';
import Header from '@/components/ui/header';
import { ScrollView } from 'react-native';
import { colors } from '@/lib/colors';

export const joinRoom = async (code: string, name: string, avatar: string) => {
  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("*")
    .eq("code", code)
    .single();

  if (roomError || !room) throw new Error("Room does not exist");

  const { data: player, error: playerError } = await supabase
    .from("players")
    .insert({
      room_code: code,
      name,
      avatar,
    })
    .select()
    .single();

  if (playerError) throw playerError;

  return player;
};

const PlayerCard = ({ player }: { player: any }) => {
  const renderAvatar = (avatarName: string) => {
    switch (avatarName) {
      case 'avatar1.png':
        return require('../../assets/avatars/avatar1.png');
      case 'avatar2.png':
        return require('../../assets/avatars/avatar2.png');
      case 'avatar3.png':
        return require('../../assets/avatars/avatar3.png');
      case 'avatar4.png':
        return require('../../assets/avatars/avatar4.png');
      default:
        return require('../../assets/avatars/avatar1.png');
    }
  };

  return (
    <View style={styles.playerCard}>
      <Text style={styles.player}>{player.name}</Text>
      <Image source={renderAvatar(player.avatar)} style={styles.avatar} />
    </View>
  );
};


const PlayerGrid = ({ players }: { players: any[] }) => {
  return (
    <ScrollView style={styles.playersContainer}>
      {Array.from({ length: Math.ceil(players.length / 2) }).map((_, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {players
            .slice(rowIndex * 2, rowIndex * 2 + 2)
            .map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
        </View>
      ))}
    </ScrollView>
  );
};




export default function LobbyScreen() {
  const router = useRouter();
  const { code } = useLocalSearchParams<{ code: string }>();

  const [name, setName] = useState("");
  const [players, setPlayers] = useState<any[]>([]);
  const [nameAdded, setNameAdded] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchPlayers = async () => {
    if (!code) return;

    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("room_code", code)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setPlayers(data);
    }
    setLoading(false);
  };

  const handleJoin = async () => {
    if (!name.trim() || !code) return;

    try {
      const avatar = "avatar4.png";
      const newPlayer = await joinRoom(code, name, avatar);

      setPlayers((prev) => [...prev, newPlayer]);

      setNameAdded(true);
      setName("");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to join room");
      console.error(err);
    }
  };


  useEffect(() => {
    if (!code) return;

    fetchPlayers();

    const playerSub = supabase
      .channel('public:players')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players',
          filter: `room_code=eq.${code}`,
        },
        (payload) => {
          setPlayers((prev) => {
            const exists = prev.some(p => p.id === payload.new.id);
            if (exists) {
              return prev.map(p => p.id === payload.new.id ? payload.new : p);
            } else {
              return [...prev, payload.new];
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(playerSub);
    };
  }, [code]);


  const handleBegin = () => {
    Alert.alert("Game Started!");
    router.push('/ar');
  };


  const renderAvatar = (avatarName: string) => {
    switch (avatarName) {
      case "avatar1.png":
        return require("../../assets/avatars/avatar1.png");
      case "avatar2.png":
        return require("../../assets/avatars/avatar2.png");
      case "avatar3.png":
        return require("../../assets/avatars/avatar3.png");
      case "avatar4.png":
        return require("../../assets/avatars/avatar4.png");
      default:
        return require("../../assets/avatars/avatar1.png");
    }
  };

  if (loading) return <Text style={{ color: "white" }}>Loading...</Text>;

  return (
    <View style={{ flex: 1, backgroundColor: "#001e5f" }}>
      <ImageBackground
        source={require("../../assets/background4.png")}
        style={styles.background}
      >
        <Header
          title={`Code: ${code}`}
          onBackPress={() => router.back()}
        />

        <PlayerGrid players={players} />

        <View style={styles.container}>
          <View style={styles.inputRow}>
            <TouchableOpacity
              style={[styles.joinButtonRow, nameAdded && { opacity: 0.5 }]}
              onPress={handleJoin}
              disabled={nameAdded}
            >
              <Text style={styles.buttonText}>Join</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.inputRowField}
              value={name}
              onChangeText={setName}
              editable={!nameAdded}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.beginButton,
              !nameAdded && { opacity: 0.5 }
            ]}
            onPress={handleBegin}
            disabled={!nameAdded}
          >
            <Text style={styles.buttonText}>Begin</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.primary.navy,
  },
  playersContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  playerCard: {
    padding: 14,
    marginVertical: 3,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    flex: 1,
  },
  avatar: {
    height: 80,
    width: '100%',
    resizeMode: 'contain',
    marginTop: 8,
  },
  player: {
    fontSize: 25,
    fontFamily: 'pix',
    color: colors.primary.navy,
    textAlign: 'center',
    backgroundColor: colors.tertiary.white,
    padding: 5,
    paddingHorizontal: 10,
    borderWidth: 2.5,
    borderColor: colors.primary.navy,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 0,
  },
  joinButtonRow: {
    backgroundColor: colors.secondary.connectiveCornflower,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginRight: 10,
    borderWidth: 2.5,
    borderColor: colors.primary.navy,
  },
  inputRowField: {
    flex: 1,
    borderWidth: 2.5,
    borderColor: colors.primary.navy,
    padding: 14,
    fontSize: 20,
    fontFamily: 'pix',
    backgroundColor: colors.tertiary.white,
  },
  beginButton: {
    backgroundColor: colors.secondary.yellowjacketGold,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: colors.primary.navy,
    marginTop: 8,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: 'Snowball',
    color: colors.primary.navy,
  },
});
