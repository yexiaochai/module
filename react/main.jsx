(function () {

    require.config({
        paths: {
            'text': 'libs/require.text',
            'AbstractView': 'js/view',

            'Vue': 'libs/vue'


        }
    });

    var NumText = React.createClass({
        getInitialState: function() {
            return {value: 50};
        },
        propTypes: {
            value: React.PropTypes.number
        },
        handleChange: function (e) {
            var v = parseInt(e.target.value);
            if(v > this.props.max || v < this.props.min  ) return;
            if(isNaN(v)) v = '';
            this.setState({value: v});
        },
        render: function () {
            return (
                <input type="text" value={this.state.value} onChange={this.handleChange} />
            );
        }
    });

    React.render(
    <NumText min="0" max="100" />,
        document.body
    );

    return

    require(['pages/list'], function (VueList) {

    });

})();
