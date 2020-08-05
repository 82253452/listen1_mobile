import {
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SortableListView from 'react-native-sortable-listview';
import useEffectOnce from 'react-use/lib/useEffectOnce';
import useUpdateEffect from 'react-use/lib/useUpdateEffect';

function RowComponent({sortHandlers, data, onRowPress, renderRow}) {
  return (
    <TouchableOpacity
      underlayColor="#eee"
      style={{
        paddingLeft: 20,
        paddingRight: 20,
        borderBottomWidth: 1,
        borderColor: '#eee',
      }}
      onPress={onRowPress}>
      <View style={{height: 50}}>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              flex: 0,
              flexBasis: 50,
              width: 50,
            }}>
            <Icon
              name={data.selected ? 'check-box' : 'check-box-outline-blank'}
              size={30}
              color={data.selected ? '#333' : '#d2d2d2'}
            />
          </View>

          {renderRow(data)}
          <TouchableWithoutFeedback
            style={{
              flex: 0,
              flexBasis: 50,
              width: 50,
            }}
            {...sortHandlers}>
            <Icon name="reorder" size={30} color="#d2d2d2" />
          </TouchableWithoutFeedback>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function swapElement(a, f, t) {
  let from = f;
  let to = t;

  if (from > to) {
    from = t;
    to = f;
  }

  return [
    ...a.slice(0, from),
    a[to],
    ...a.slice(from + 1, to),
    a[from],
    ...a.slice(to + 1),
  ];
}

export function ListEditor({renderRow, data: dataProps, onChange}) {
  const [data, setData] = useState(dataProps);
  const [order, setOrder] = useState();

  useEffectOnce(() => {
    const dataMap = new Map();
    data.forEach((item) => {
      dataMap[item.id] = Object.assign({}, item, {
        selected: false,
        key: item.id,
      });
    });
    setData(dataMap);
    setOrder(Object.keys(dataMap));
  });
  useUpdateEffect(() => {
    onChange(getData());
  }, [order]);

  function onRowPress(row) {
    setData({
      ...data,
      [row.key]: {
        ...data[row.key],
        selected: !data[row.key].selected,
      },
    });
  }
  function onDeletePress() {
    const toDeleted = {};
    const newData = {};
    Object.keys(data).forEach((key) => {
      if (data[key].selected) {
        toDeleted[key] = true;
      } else {
        newData[key] = data[key];
      }
    });

    const newOrder = order.filter((i) => toDeleted[i] !== true);
    setData(newData);
    setOrder(newOrder);
  }
  function onRowMoved(e) {
    setOrder(swapElement(order, e.from, e.to));
  }
  function getData() {
    const result = [];
    order.forEach((key) => {
      const item = data[key];
      result.push(
        Object.assign({}, item, {key: undefined, selected: undefined}),
      );
    });

    return result;
  }

  return (
    <View style={{flex: 1}}>
      <SortableListView
        style={{flex: 1}}
        data={data}
        order={order}
        onRowMoved={(e) => {
          onRowMoved(e);
        }}
        activeOpacity={1}
        moveOnPressIn
        sortRowStyle={{backgroundColor: '#ddd'}}
        renderRow={(row) => (
          <RowComponent
            data={row}
            onRowPress={() => {
              onRowPress(row);
            }}
            renderRow={renderRow}
          />
        )}
      />
      <View
        style={{
          backgroundColor: '#eee',
          flex: 0,
          flexBasis: 70,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <TouchableOpacity onPress={onDeletePress}>
          <View
            style={{
              flex: 0,
              flexBasis: 70,
              width: 70,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon name="delete-forever" size={30} color="#d2d2d2" />
            <Text> 删除 </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
