export default function reactAutoBinding (that) {
  const {
    constructor,
    componentWillMount,
    UNSAFE_componentWillMount,
    render,
    componentDidMount,
    componentWillReceiveProps,
    UNSAFE_componentWillReceiveProps,
    shouldComponentUpdate,
    componentWillUpdate,
    UNSAFE_componentWillUpdate,
    getSnapshotBeforeUpdate,
    componentDidUpdate,
    componentWillUnmount,
    componentDidCatch,
    ...methods
  } = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(that));

  Object.keys(methods).forEach((key) => {
    that[key] = that[key].bind(that)
  });
}