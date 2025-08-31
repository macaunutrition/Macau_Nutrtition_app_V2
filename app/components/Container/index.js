import React from 'react'
import { ScrollView, StyleSheet, Text, View,SafeAreaView } from 'react-native'
import { scale } from 'react-native-size-matters'

export default function Container({children,isScrollable,bodyStyle}) {
    return (
        <SafeAreaView  style={styles.container}>
            {
                isScrollable? <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
                    <View style={[styles.innerView,bodyStyle]}>
                        {children}
                    </View>
                </ScrollView>
                :
                <View style={[styles.innerView,bodyStyle]}>{children}</View>
            }
        </SafeAreaView>
    )
}
const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    innerView:{
        flex:1,
        paddingHorizontal:scale(12) // Reduced from 20 to 12 to make product cards wider (8 pixels closer to edges)
    }
})
