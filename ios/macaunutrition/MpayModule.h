#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <OpenSDK/OpenSDK.h>

@interface MpayModule : RCTEventEmitter <RCTBridgeModule, OpenSDKDelegate>
@end
