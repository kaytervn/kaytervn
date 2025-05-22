<h1 align="center">Design Pattern</h1>

|     Group      | Design Pattern                                                                                                                        |
| :------------: | :------------------------------------------------------------------------------------------------------------------------------------ |
| **Creational** | Singleton, Factory, Abstract Factory, Prototype, Builder, Dependency Injection, MVC                                                   |
| **Structural** | Adapter, Facade, Composite, Decorator, Bridge, Flyweight, Proxy, DAO                                                                  |
| **Behavioral** | Template, Observer, Mediator, State, Strategy, Chain of Responsibility, Visitor, Memento, Iterator, Interpreter, Command, Null Object |

<h2>Creational</h2>

<details>
<summary>
Singleton
</summary>

<i><b>Singleton</b> ensure that a class has only one instance, while providing a global access point to this instance.</i>

![](https://refactoring.guru/images/patterns/diagrams/singleton/structure-en.png?id=4e4306d3a90f40d74c7a4d2d2506b8ec)

</details>

<details>
<summary>
Factory
</summary>

<i><b>Factory</b> provides an interface for creating objects in a superclass, but allows subclasses to alter the type of objects that will be created.</i>

![](https://refactoring.guru/images/patterns/diagrams/factory-method/structure.png?id=4cba0803f42517cfe8548c9bc7dc4c9b)

</details>

<details>
<summary>
Abstract Factory
</summary>

<i><b>Abstract Factory</b> creates entire product families without specifying their concrete classes.</i>

![](https://refactoring.guru/images/patterns/diagrams/abstract-factory/structure.png?id=a3112cdd98765406af94595a3c5e7762)

</details>

<details>
<summary>
Prototype
</summary>

<i><b>Prototype</b> allows cloning objects, even complex ones, without coupling to their specific classes.</i>

![](https://refactoring.guru/images/patterns/diagrams/prototype/structure.png?id=088102c5e9785ff45debbbce86f4df81)

</details>

<details>
<summary>
Builder
</summary>

<i><b>Builder</b> allows constructing complex objects step by step.</i>

![](https://refactoring.guru/images/patterns/diagrams/builder/structure.png?id=fe9e23559923ea0657aa5fe75efef333)

</details>

<details>
<summary>Dependency Injection</summary>

1. Create Maven Project.

2. Config Spring Core to file `pom.xml`.

```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>6.1.4</version>
</dependency>
```

3. From directory `src/main/resources`, create file `application_context.xml`, and config Spring Beans.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://www.springframework.org/schema/beans
		https://www.springframework.org/schema/beans/spring-beans.xsd">

	<bean id="..." class="...">
		<!-- collaborators and configuration for this bean go here -->
	</bean>

	<bean id="..." class="...">
		<!-- collaborators and configuration for this bean go here -->
	</bean>

	<!-- more bean definitions go here -->

</beans>
```

4. Init Application Context in use:

```
ApplicationContext context = new ClassPathXmlApplicationContext("application_context.xml");
```

</details>

<h2>Structural</h2>

<details>
<summary>
Adapter
</summary>

<i><b>Adapter</b> allows objects with incompatible interfaces to collaborate.</i>

**Object Adapter:**

![](https://refactoring.guru/images/patterns/diagrams/adapter/structure-object-adapter.png?id=33dffbe3aece294162440c7ddd3d5d4f)

**Class Adapter:**

![](https://refactoring.guru/images/patterns/diagrams/adapter/structure-class-adapter.png?id=e1c60240508146ed3b98ac562cc8e510)

</details>

<details>
<summary>
Facade
</summary>

<i><b>Facade</b> provides a simplified interface to a library, a framework, or any other complex set of classes.</i>

![](https://refactoring.guru/images/patterns/diagrams/facade/structure.png?id=258401362234ac77a2aaf1cde62339e7)

</details>

<details>
<summary>
Composite
</summary>

<i><b>Composite</b> allows composing objects into a tree-like structure and work with the it as if it was a singular object.</i>

![](composite.png)

</details>

<details>
<summary>
Decorator
</summary>

<i><b>Decorator</b> allows adding new behaviors to objects dynamically by placing them inside special wrapper objects, called decorators.</i>

![](https://refactoring.guru/images/patterns/diagrams/decorator/structure.png?id=8c95d894aecce5315cc1b12093a7ea0c)

</details>

<details>
<summary>
Bridge
</summary>

<i><b>Bridge</b> divides business logic or huge class into separate class hierarchies that can be developed independently.</i>

![](https://refactoring.guru/images/patterns/diagrams/bridge/structure-en.png?id=827afa4b40008dc29d26fe0f4d41b9cc)

</details>

<details>
<summary>
Flyweight
</summary>

<i><b>Flyweight</b> allows to fit more objects into the available amount of RAM by sharing common parts of state between multiple objects instead of keeping all of the data in each object.</i>

![](https://refactoring.guru/images/patterns/diagrams/flyweight/structure.png?id=c1e7e1748f957a4792822f902bc1d420)

</details>

<details>
<summary>
Proxy
</summary>

<i><b>Proxy</b> provides an object that acts as a substitute for a real service object used by a client. A proxy receives client requests, does some work (access control, caching, etc.) and then passes the request to a service object.</i>

![](https://refactoring.guru/images/patterns/diagrams/proxy/structure.png?id=f2478a82a84e1a1e512a8414bf1abd1c)

</details>

<h2>Behavioral</h2>
<details>
<summary>
Template
</summary>

<i><b>Template</b> defines the skeleton of an algorithm in the superclass but lets subclasses override specific steps of the algorithm without changing its structure.</i>

![](https://refactoring.guru/images/patterns/diagrams/template-method/structure.png?id=924692f994bff6578d8408d90f6fc459)

</details>

<details>
<summary>
Observer
</summary>

<i><b>Observer</b> defines a subscription mechanism to notify multiple objects about any events that happen to the object they’re observing.</i>

![](https://refactoring.guru/images/patterns/diagrams/observer/structure.png?id=365b7e2b8fbecc8948f34b9f8f16f33c)

</details>

<details>
<summary>
Mediator
</summary>

<i><b>Mediator</b> reduces coupling between components of a program by making them communicate indirectly, through a special mediator object.</i>

![](https://refactoring.guru/images/patterns/diagrams/mediator/structure.png)

</details>

<details>
<summary>
State
</summary>

<i><b>State</b> lets an object alter its behavior when its internal state changes. It appears as if the object changed its class.</i>

![](https://refactoring.guru/images/patterns/diagrams/state/structure-en.png)

</details>

<details>
<summary>
Strategy
</summary>

<i><b>Strategy</b> defines a family of algorithms, put each of them into a separate class, and make their objects interchangeable.</i>

![](https://refactoring.guru/images/patterns/diagrams/strategy/structure.png)

</details>

<details>
<summary>
Chain of Responsibility
</summary>

<i><b>Chain of Responsibility</b> passes requests along a chain of handlers. Upon receiving a request, each handler decides either to process the request or to pass it to the next handler in the chain.</i>

![](https://refactoring.guru/images/patterns/diagrams/chain-of-responsibility/structure.png)

</details>

<details>
<summary>
Visitor
</summary>

<i><b>Visitor</b> separates algorithms from the objects on which they operate.</i>

![](https://refactoring.guru/images/patterns/diagrams/visitor/structure-en.png)

</details>

<details>
<summary>
Memento
</summary>

<i><b>Memento</b> saves and restores the previous state of an object without revealing the details of its implementation.</i>

![](https://refactoring.guru/images/patterns/diagrams/memento/structure1.png)

</details>

<details>
<summary>
Iterator
</summary>

<i><b>Iterator</b> allows sequential traversal through a complex data structure without exposing its internal details.</i>

![](https://refactoring.guru/images/patterns/diagrams/iterator/structure.png)

</details>

<details>
<summary>
Command
</summary>

<i><b>Command</b> turns a request into a stand-alone object that contains all information about the request. This transformation lets you pass requests as a method arguments, delay or queue a request’s execution, and support undoable operations.</i>

![](https://refactoring.guru/images/patterns/diagrams/command/structure.png)

</details>
