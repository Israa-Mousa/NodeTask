import ImageKit from '@imagekit/nodejs';
import { ConfigService } from '@nestjs/config';
import { EnvVariables } from 'src/types/declartion-mergin';

export const imageKitToken = 'ImageKitProvider';

export const ImageKitProvider = {
  provide: imageKitToken,
  useFactory: async (configService: ConfigService<EnvVariables>) => {
  const secret = configService.get('IMAGEKIT_SECRET_KEY');
  const publicKey = configService.get('IMAGEKIT_PUBLIC_KEY');
  const urlEndpoint = configService.get('IMAGEKIT_URL_ENDPOINT');

  console.log('ImageKitProvider env:', { hasSecret: !!secret, hasPublic: !!publicKey, urlEndpoint: !!urlEndpoint });

  const client = new ImageKit({
    privateKey: configService.getOrThrow('IMAGEKIT_SECRET_KEY'),
    publicKey: configService.getOrThrow('IMAGEKIT_PUBLIC_KEY'),
    urlEndpoint: configService.getOrThrow('IMAGEKIT_URL_ENDPOINT'),
  } as any);

  return client;
  },
  inject: [ConfigService],
};
