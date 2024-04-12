export function log(label?: string) {
  return function (target: any, name: string, decorator: PropertyDescriptor) {
    const method = target[name];
    decorator.value = function () {
      console.group(label ?? "DefaultGroup");
      console.log("input argu", arguments);
      method(arguments);
      console.groupEnd();
    };

    return decorator;
  };
}
