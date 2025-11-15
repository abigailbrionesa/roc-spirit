import { Text as RNText, TextProps } from 'react-native';

export default function Text({ style, ...props }: TextProps) {
  return <RNText style={[{ fontFamily: 'InterBold', fontSize:40 }, style]} {...props} />;
}
