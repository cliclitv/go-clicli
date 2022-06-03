import { h, useState } from 'fre'

let pathCache = {}
let routesCache = null
let routeStack = null

export function useRoutes(routes) {

  const setter = useState(0)[1]

  let stack = {
    routes: Object.entries(routesCache || routes),
    setter,
    component: null,
    props: {}
  }

  routesCache = routes
  routeStack = stack

  perfrom(routeStack)

  return typeof stack.component.then === 'function' ? <div>loading...</div> : h(stack.component, {}, null)
}

let index = 0

function perfrom(stack) {
  const { routes, setter } = stack
  const currentPath = location.pathname || '/'
  let path, component, props, ii

  for (let i = 0; i < routes.length; i++) {
    ii = i
    const route = routes[i]
    path = route[0]
    component = route[1]
    const [reg, params] = pathSlice(path)

    const res = currentPath.match(reg)
    if (!res) {
      component = () => { }
      continue
    }

    if (params.length) {
      props = {}
      params.forEach((item, index) => (props[item] = res[index + 1]))
    }
    break
  }

  Object.assign(stack, {
    path,
    component,
    props
  })

  if (typeof component.then === 'function') {
    component.then(res => {
      if (index > 10) return
      index++
      routesCache[path] = res.default
      setter(Symbol())
    })
  } else {
    setter(Symbol())
  }



}

function pathSlice(path) {
  if (pathCache[path]) return pathCache[path]
  const slice = [
    new RegExp(
      `${path.substr(0, 1) === '*' ? '' : '^'}${path
        .replace(/:[a-zA-Z]+/g, '([^/]+)')
        .replace(/\*/g, '')}${path.substr(-1) === '*' ? '' : '$'}`
    )
  ]

  const params = path.match(/:[a-zA-Z]+/g)
  slice.push(params ? params.map(name => name.substr(1)) : [])

  pathCache[path] = slice
  return slice
}

export function push(url) {
  window.history.pushState(null, null, url)
  perfrom(routeStack)
}


window.addEventListener('popstate', () => perfrom(routeStack))

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

export function A(props) {
  const { onClick: onclick, children } = props

  const onClick = e => {
    if (onclick) onclick(e)
    if (
      !event.defaultPrevented && // onClick prevented default
      event.button === 0 && // ignore everything but left clicks
      (!props.target || props.target === '_self') && // let browser handle "target=_blank" etc.
      !isModifiedEvent(event) // ignore clicks with modifier keys
    ) {
      e.preventDefault()
      push(e.target.href)
    }
  }

  return (
    <a {...props} onClick={onClick}>
      {children}
    </a>
  )
}