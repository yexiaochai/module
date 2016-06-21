
//活动表
var  activity = {
    id: '唯一id',
    title: '活动标题'
}


/*
组件类型,可能的数据为:
这里严格一点的话可以 {title: string},我们这里只是demo就不太较真
*/
var wiget_type = {
    id: '唯一标识',
    data: '描述数据格式的json串'
};

//因为我们暂时只有6个组件类型便直接穷举出所有组件的数据类型
var wiget_type = {
    //title类组件只包含title字段
    title: '',
    vote: []
};

//组件类型
var widget = {
    id: '唯一id',
    name: '组件名字',
    data: '真实的数据json串',
    typeId: '对应组件类型'
}

//一个活动拥有哪些组件,与活动表与组件表为外键约束
var activity_widget = {
    activityId: '活动id',
    widgetId: '组件id'
}

