//From https://github.com/shahnawaz/react-native-barcode-mask/

import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native'; //Animated, 

const defaultProps = {
    width: 280,
    height: 230,
    edgeWidth: 20,
    edgeHeight: 20,
    edgeColor: '#FFF',
    edgeRadius: 1,
    edgeBorderWidth: 4,
    backgroundColor: 'rgb(0, 0, 0)',
    outerMaskOpacity: 0.6,
    // showAnimatedLine: true,
    // animatedLineColor: '#FFF',
    // animatedLineHeight: 2,
    // animatedLineWidth: '85%',
    // lineAnimationDuration: 5000,
    // animatedLineOrientation: 'horizontal',
    useNativeDriver: true
  };

const BarcodeMask = (props) => {
    //console.log("render barcode mask")
    const [edgeRadiusOffset, SetEdgeRadiusOffset] = useState(props.edgeRadius ? -Math.abs(props.edgeRadius / 3) : 0)

    const { 
        width,
        height,
        // showAnimatedLine,
        // animatedLineColor,
        // animatedLineWidth,
        // animatedLineHeight,
        // animatedLineOrientation,
        edgeBorderWidth
      } = defaultProps;

    const applyMaskFrameStyle = () => {
        const { backgroundColor, outerMaskOpacity } = props;
        return { backgroundColor, opacity: outerMaskOpacity, flex: 1 };
    };

    const renderEdge = (edgePosition) => {
        const { edgeWidth, edgeHeight, edgeColor, edgeBorderWidth, edgeRadius } = defaultProps;
        //console.log("render edge position: " + edgeWidth)
        const defaultStyle = {
            width: edgeWidth,
            height: edgeHeight,
            borderColor: edgeColor
        };
        const edgeBorderStyle = {
            topRight: {
                borderRightWidth: edgeBorderWidth,
                borderTopWidth: edgeBorderWidth,
                borderTopRightRadius: edgeRadius,
                top: edgeRadiusOffset,
                right: edgeRadiusOffset,
            },
            topLeft: {
                borderLeftWidth: edgeBorderWidth,
                borderTopWidth: edgeBorderWidth,
                borderTopLeftRadius: edgeRadius,
                top: edgeRadiusOffset,
                left: edgeRadiusOffset
            },
            bottomRight: {
                borderRightWidth: edgeBorderWidth,
                borderBottomWidth: edgeBorderWidth,
                borderBottomRightRadius: edgeRadius,
                bottom: edgeRadiusOffset,
                right: edgeRadiusOffset
            },
            bottomLeft: {
                borderLeftWidth: edgeBorderWidth,
                borderBottomWidth: edgeBorderWidth,
                borderBottomLeftRadius: edgeRadius,
                bottom: edgeRadiusOffset,
                left: edgeRadiusOffset,
            },
        };
        return <View style={[defaultStyle, styles[edgePosition + 'Edge'], edgeBorderStyle[edgePosition]]} />;
    };

   /*  function calculateLineTravelWindowDistance({ layout, isHorizontalOrientation }) {
        return (((isHorizontalOrientation ? layout.height : layout.width) - 10) / 2);
    } */

    const onFinderLayoutMeasured = ({ nativeEvent }) => {
        const { animatedLineOrientation, onLayoutMeasured } = props;
        const { layout } = nativeEvent;
        const isHorizontal = animatedLineOrientation !== 'vertical';
        /* const travelDistance = calculateLineTravelWindowDistance({
            layout,
            isHorizontalOrientation: isHorizontal,
        });
        SetEdgeRadiusOffset({ //this.setState 
            top: new Animated.Value(-travelDistance),
            left: new Animated.Value(-travelDistance),
            lineTravelWindowDistance: travelDistance,
            finderLayout: layout,
        }) */
        if (onLayoutMeasured) {
            onLayoutMeasured({ nativeEvent });
        }
    }

    return (
        <View style={[styles.container]}>
            <View
                style={[styles.finder, { width, height }]}
                onLayout={onFinderLayoutMeasured}
            >
                {renderEdge('topLeft')}
                {renderEdge('topRight')}
                {renderEdge('bottomLeft')}
                {renderEdge('bottomRight')}
            </View>
            <View style={styles.maskOuter}>
                <View style={[styles.maskRow, applyMaskFrameStyle()]} />
                <View style={[{ height }, styles.maskCenter]} >
                    <View style={[applyMaskFrameStyle()]} />
                    <View style={[styles.maskInner, { width, height }]} />
                    <View style={[applyMaskFrameStyle()]} />
                </View>
                <View style={[styles.maskRow, applyMaskFrameStyle()]} />
            </View>
        </View>
    );      
    
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        ...StyleSheet.absoluteFillObject,
    },
    finder: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    topLeftEdge: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    topRightEdge: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    bottomLeftEdge: {
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
    bottomRightEdge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
    },
    maskOuter: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    maskInner: {
        backgroundColor: 'transparent',
    },
    maskRow: {
        width: '100%',
    },
    maskCenter: {
        display: 'flex',
        flexDirection: 'row',
    },
    animatedLine: {
        position: 'absolute',
        elevation: 4,
        zIndex: 0,
    },
});

export default BarcodeMask