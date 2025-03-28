Pod::Spec.new do |s|
  s.name             = 'MpayModule'
  s.version          = '0.1.0'
  s.summary          = 'A custom mpay module for React Native'
  s.description      = 'A more detailed description of the module.'
  s.authors          = { 'Himanshu Bhuyan' => 'himanshubhuyan0@gmail.com' }
  s.license          = { :type => 'MIT', :text => 'https://opensource.org/licenses/MIT' }
  s.homepage         = 'https://github.com/himanshubhuyan0/MpayModule'
  s.source           = { :git => 'https://github.com/himanshubhuyan0/MpayModule.git', :tag => '0.1.0' }
  s.source_files     = 'ios/macaunutrition/*.{h,m}'  # Correct relative path
  s.dependency       'React-Core'
  s.platform         = :ios, '13.4'
  s.requires_arc     = true
end
