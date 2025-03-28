#import "MpayModule.h"
#import <React/RCTLog.h>
#import <React/RCTBridgeModule.h>
#import <OpenSDK/OpenSDK.h>
#import <React/RCTEventEmitter.h>


@implementation MpayModule {
    BOOL hasListeners;
}

// Export the module to React Native
RCT_EXPORT_MODULE();

// Initialize OpenSDK
RCT_EXPORT_METHOD(setEnvironmentType:(NSString *)environment resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    @try {
        if ([environment isEqualToString:@"UAT"]) {
            [[OpenSDK sharedInstance] setEnvironmentType:MPay_UAT];
        } else if ([environment isEqualToString:@"Prod"]) {
            [[OpenSDK sharedInstance] setEnvironmentType:MPay_Prod];
        } else {
            // If the environment is invalid, reject the promise with an error
            reject(@"SET_ENV_ERROR", @"Invalid environment type provided", nil);
            return;
        }

        // If setting the environment was successful, resolve the promise
        resolve(@"Environment set successfully");
    }
    @catch (NSException *exception) {
        // In case of an error, reject the promise
        reject(@"SET_ENV_ERROR", exception.reason, nil);
    }
}

RCT_EXPORT_METHOD(setMPayAppId:(NSInteger)appId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  NSLog(@"Setting MPay App ID: %ld", (long)appId);
  @try {
    // Set the appId in Macau Pay SDK (replace with actual SDK method)
    // Example: [OpenSdk setMPayAppId:appId];
    
    // If operation is successful, resolve with a message
    NSLog(@"App ID set successfully");
    resolve(@"Mpay appID set");
  }
  @catch (NSException *exception) {
    // In case of an error, reject the promise with an error message
    NSLog(@"Error setting MPay App ID: %@", exception.reason);
    reject(@"SET_APP_ID_ERROR", @"Failed to set MPAY App ID", nil);
  }
}
RCT_EXPORT_METHOD(transacQapi:(NSString *)params resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  // Check if params are not empty
  if (!params || [params length] == 0) {
    reject(@"INVALID_PARAMS", @"Params cannot be nil or empty", nil);
    return;
  }

  // Log the received stringified JSON (for debugging purposes)
  NSLog(@"Received JSON String: %@", params);
  
  NSError *error;

  // Deserialize the JSON string into a dictionary
  NSData *jsonData = [params dataUsingEncoding:NSUTF8StringEncoding];
  NSDictionary *paramsDict = [NSJSONSerialization JSONObjectWithData:jsonData options:0 error:&error];
  
  if (error) {
    // Reject if JSON parsing fails
    reject(@"JSON_PARSE_ERROR", @"Failed to parse JSON", error);
    return;
  }
  
  // Log the parsed dictionary (for debugging purposes)
  NSLog(@"Parsed params dictionary: %@", paramsDict);
  
  // Set up the request
  NSURL *url = [NSURL URLWithString:@"https://uatopenapi.macaupay.com.mo/masl/umpg/gateway"];
  NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url];
  request.HTTPMethod = @"POST";
  
  // Set necessary headers
  [request setValue:@"application/json;charset=utf-8" forHTTPHeaderField:@"Content-Type"];
  [request setValue:@"application/json" forHTTPHeaderField:@"Accept"];
  
  // Set the HTTP body as the JSON data
  request.HTTPBody = [params dataUsingEncoding:NSUTF8StringEncoding];

  // Create the data task for the API call
  NSURLSessionDataTask *dataTask = [[NSURLSession sharedSession] dataTaskWithRequest:request completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
    if (error) {
      // Reject the promise with the error
      reject(@"NETWORK_ERROR", error.localizedDescription, error);
      return;
    }

    // Ensure there's data in the response
    if (data) {
      NSError *jsonError;
      NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data options:0 error:&jsonError];

      if (jsonError) {
        // If JSON parsing fails, reject the promise
        reject(@"PARSE_ERROR", @"Error parsing response", jsonError);
      } else {
        // Check if the response indicates success
        NSString *isSuccess = json[@"is_success"];
        if ([isSuccess isEqualToString:@"T"]) {
          // If successful, resolve the promise with the response JSON
          resolve(json);
        } else {
          // Reject if the transaction failed
          reject(@"TRANSACTION_FAILED", @"Transaction failed", nil);
        }
      }
    } else {
      // Reject if no data is returned
      reject(@"NO_DATA", @"No data returned from API", nil);
    }
  }];

  // Start the data task
  [dataTask resume];
}
// Payment method
RCT_EXPORT_METHOD(allPay:(NSString *)params
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  if (!params || [params length] == 0) {
      reject(@"INVALID_PARAMS", @"Params cannot be nil or empty", nil);
      return;
    }

    // Debugging log to check the stringified params
    NSLog(@"Received JSON String: %@", params);
    
    NSError *error;
    
    // Deserialize the JSON string back to an NSDictionary
    NSData *jsonData = [params dataUsingEncoding:NSUTF8StringEncoding];
    NSDictionary *paramsDict = [NSJSONSerialization JSONObjectWithData:jsonData options:0 error:&error];
    
    if (error) {
      // Reject if JSON parsing fails
      reject(@"JSON_PARSE_ERROR", @"Failed to parse JSON", error);
      return;
    }
    
    // Now you have an NSDictionary, use it for further processing
    NSLog(@"Parsed params dictionary: %@", paramsDict);
    
    // Continue with your logic for payment processing
    dispatch_async(dispatch_get_main_queue(), ^{
      [[OpenSDK sharedInstance] MPayWithJsonString:params
                                        withSchema:@"com.macauntrition.shopapp"
                                        WithSender:self
                                       withDelegate:self];
    });
}

// Handle payment success
- (void)OpenSDK_WithPayStatus:(bool)status WithOrder:(NSDictionary *)order {
    if (hasListeners) {
        [self sendEventWithName:@"onPaymentSuccess" body:@{@"status": @(status), @"order": order}];
    }
}

// Handle payment failure
- (void)OpenSDK_WithFailed:(NSString *)errorInfo withErrorCode:(NSString *)errorCode {
    if (hasListeners) {
        [self sendEventWithName:@"onPaymentFailure" body:@{@"errorInfo": errorInfo, @"errorCode": errorCode}];
    }
}

// Register events
- (NSArray<NSString *> *)supportedEvents {
    return @[@"onPaymentSuccess", @"onPaymentFailure"];
}

// Add listeners (for JS side)
-(void)startObserving {
    hasListeners = YES;
}

-(void)stopObserving {
    hasListeners = NO;
}

@end
