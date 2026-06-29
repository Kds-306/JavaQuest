/* ═══════════════════════════════════════════════
   JavaQuest — game.js
   Features: timer, keyboard nav, expanded Q bank,
             score save, animated background
═══════════════════════════════════════════════ */

const BASE_URL = "https://javaquest-1.onrender.com";
const TIMER_SECONDS = 20;
const QUESTIONS_PER_GAME = 10;

// ── DOM refs ─────────────────────────────────
const screens      = { intro: "screen-intro", game: "screen-game", result: "screen-result" };
const levelCards   = document.querySelectorAll(".level-card");
const playerInput  = document.getElementById("playerName");
const startBtn     = document.getElementById("startBtn");
const ghLevel      = document.getElementById("gh-level");
const ghQnum       = document.getElementById("gh-qnum");
const ghScore      = document.getElementById("gh-score");
const progressFill = document.getElementById("progressFill");
const timerFill    = document.getElementById("timerFill");
const questionCard = document.getElementById("questionCard");
const questionText = document.getElementById("questionText");
const optButtons   = document.querySelectorAll(".opt-btn");
const feedbackText = document.getElementById("feedbackText");
const nextBtn      = document.getElementById("nextBtn");
const playAgainBtn = document.getElementById("playAgainBtn");

// ── State ─────────────────────────────────────
let selectedLevel = "";
let questions     = [];
let currentIndex  = 0;
let score         = 0;
let correctCount  = 0;
let timerInterval = null;
let timeLeft      = TIMER_SECONDS;
let answered      = false;

// ── Question Bank (50 per level) ──────────────
const questionBank = {
  beginner: [
    { text: "Which keyword is used to create an object in Java?",
      options: ["class", "new", "this", "static"], answer: "new" },
    { text: "Which method is the entry point of a Java program?",
      options: ["start()", "main()", "run()", "init()"], answer: "main()" },
    { text: "What is the default value of an int in Java?",
      options: ["null", "1", "0", "undefined"], answer: "0" },
    { text: "Which of these is NOT a primitive type in Java?",
      options: ["int", "boolean", "String", "char"], answer: "String" },
    { text: "How do you print text to the console in Java?",
      options: ["print()", "console.log()", "System.out.println()", "echo()"], answer: "System.out.println()" },
    { text: "What does the 'final' keyword do to a variable?",
      options: ["Makes it immutable", "Ends the program", "Defines a method", "Creates a loop"], answer: "Makes it immutable" },
    { text: "Which operator checks equality in Java?",
      options: ["=", "!=", "==", ":="], answer: "==" },
    { text: "What is the size of a 'long' type in Java?",
      options: ["16 bits", "32 bits", "64 bits", "128 bits"], answer: "64 bits" },
    { text: "What is the default value of a boolean in Java?",
      options: ["true", "false", "0", "null"], answer: "false" },
    { text: "Which keyword is used to define a class in Java?",
      options: ["define", "struct", "class", "object"], answer: "class" },
    { text: "What is the size of an int in Java?",
      options: ["8 bits", "16 bits", "32 bits", "64 bits"], answer: "32 bits" },
    { text: "What is the default value of a String variable in Java?",
      options: ["\"\"", "\" \"", "0", "null"], answer: "null" },
    { text: "Which loop is guaranteed to execute at least once?",
      options: ["for", "while", "do-while", "foreach"], answer: "do-while" },
    { text: "What is the range of a byte in Java?",
      options: ["0 to 255", "-128 to 127", "-256 to 255", "0 to 127"], answer: "-128 to 127" },
    { text: "Which operator is used for logical AND in Java?",
      options: ["&", "&&", "AND", "||"], answer: "&&" },
    { text: "What does JVM stand for?",
      options: ["Java Virtual Machine", "Java Variable Method", "Java Verified Module", "Java Version Manager"], answer: "Java Virtual Machine" },
    { text: "What does the 'static' keyword mean in Java?",
      options: ["Belongs to instance", "Belongs to class", "Is constant", "Is final"], answer: "Belongs to class" },
    { text: "What is the index of the first element in an array?",
      options: ["1", "-1", "0", "Depends on array"], answer: "0" },
    { text: "Which keyword exits a loop in Java?",
      options: ["exit", "stop", "break", "return"], answer: "break" },
    { text: "Which keyword skips the current iteration of a loop?",
      options: ["skip", "pass", "next", "continue"], answer: "continue" },
    { text: "What is a constructor in Java?",
      options: ["A method to destroy objects", "A method with same name as class", "A static method", "A return type"], answer: "A method with same name as class" },
    { text: "Can a constructor have a return type in Java?",
      options: ["Yes, void", "Yes, int", "No", "Yes, the class type"], answer: "No" },
    { text: "Which access modifier makes a member accessible everywhere?",
      options: ["private", "protected", "default", "public"], answer: "public" },
    { text: "What is the parent class of all Java classes?",
      options: ["Base", "Root", "Object", "Super"], answer: "Object" },
    { text: "Which exception is thrown for array index out of bounds?",
      options: ["IndexException", "ArrayException", "ArrayIndexOutOfBoundsException", "OutOfRangeException"], answer: "ArrayIndexOutOfBoundsException" },
    { text: "What is autoboxing in Java?",
      options: ["Converting String to int", "Converting primitive to wrapper class", "Converting class to array", "Boxing a method"], answer: "Converting primitive to wrapper class" },
    { text: "Which method returns the length of a String in Java?",
      options: ["size()", "count()", "length()", "len()"], answer: "length()" },
    { text: "What does the 'void' return type mean?",
      options: ["Returns zero", "Returns null", "Returns nothing", "Returns boolean"], answer: "Returns nothing" },
    { text: "What is type casting in Java?",
      options: ["Naming a type", "Converting one data type to another", "Creating a new type", "Deleting a variable"], answer: "Converting one data type to another" },
    { text: "Which keyword is used to import a package in Java?",
      options: ["include", "using", "require", "import"], answer: "import" },
    { text: "What does 'this' keyword refer to in Java?",
      options: ["Parent class", "Static method", "Current object", "Next object"], answer: "Current object" },
    { text: "What is the default value of a float in Java?",
      options: ["1.0", "null", "0.0", "undefined"], answer: "0.0" },
    { text: "Which class is used to read user input in Java?",
      options: ["Reader", "InputManager", "Scanner", "Console"], answer: "Scanner" },
    { text: "Which mathematical operation does % perform?",
      options: ["Division", "Percentage", "Modulus (remainder)", "Power"], answer: "Modulus (remainder)" },
    { text: "What is the size of a char in Java?",
      options: ["8 bits", "16 bits", "32 bits", "64 bits"], answer: "16 bits" },
    { text: "Which method converts int to String in Java?",
      options: ["int.toString()", "String.valueOf()", "Integer.toStr()", "convert()"], answer: "String.valueOf()" },
    { text: "What causes a NullPointerException?",
      options: ["Array overflow", "Wrong data type", "Accessing methods on null reference", "Infinite loop"], answer: "Accessing methods on null reference" },
    { text: "What does JDK stand for?",
      options: ["Java Development Kit", "Java Deployment Key", "Java Default Kernel", "Java Data Kit"], answer: "Java Development Kit" },
    { text: "What is the difference between '=' and '==' in Java?",
      options: ["No difference", "'=' assigns, '==' compares", "'==' assigns, '=' compares", "Both compare values"], answer: "'=' assigns, '==' compares" },
    { text: "What keyword is used for exception handling in Java?",
      options: ["handle", "error", "try-catch", "trap"], answer: "try-catch" },
    { text: "What is a package in Java?",
      options: ["A compressed file", "A namespace for organizing classes", "A method container", "A variable type"], answer: "A namespace for organizing classes" },
    { text: "Which of these is a valid Java identifier?",
      options: ["2name", "_myVar", "my-var", "class"], answer: "_myVar" },
    { text: "What is the 'char' data type in Java?",
      options: ["A String of characters", "A single Unicode character", "A character array", "A string constant"], answer: "A single Unicode character" },
    { text: "Which keyword prevents a class from being subclassed?",
      options: ["static", "abstract", "final", "private"], answer: "final" },
    { text: "What is an instance variable?",
      options: ["A variable inside a method", "A variable belonging to an object", "A static variable", "A constant"], answer: "A variable belonging to an object" },
    { text: "What is the result of 10 / 3 in Java (int division)?",
      options: ["3.33", "3", "4", "0"], answer: "3" },
    { text: "Which method is called when an object is about to be garbage collected?",
      options: ["destroy()", "delete()", "finalize()", "dispose()"], answer: "finalize()" },
    { text: "What is the use of the 'super' keyword?",
      options: ["Refers to current object", "Refers to parent class", "Refers to child class", "Refers to static context"], answer: "Refers to parent class" },
    { text: "Which data type should be used for decimal values in Java?",
      options: ["int", "long", "boolean", "double"], answer: "double" },
    { text: "What does System.exit(0) do in Java?",
      options: ["Restarts the program", "Throws an exception", "Terminates the JVM", "Returns 0 from main"], answer: "Terminates the JVM" }
  ],

  intermediate: [
    { text: "Which OOP concept allows a subclass to override a parent method?",
      options: ["Encapsulation", "Inheritance", "Abstraction", "Polymorphism"], answer: "Polymorphism" },
    { text: "Which collection does NOT allow duplicate elements?",
      options: ["List", "Set", "Map", "ArrayList"], answer: "Set" },
    { text: "What is the access modifier that restricts access to the same class?",
      options: ["public", "protected", "private", "default"], answer: "private" },
    { text: "Which interface must be implemented for a class to be used in a for-each loop?",
      options: ["Comparable", "Iterator", "Iterable", "Serializable"], answer: "Iterable" },
    { text: "What does HashMap use internally to store key-value pairs?",
      options: ["Arrays", "Linked lists", "Hashing", "Trees"], answer: "Hashing" },
    { text: "Which keyword is used to inherit a class in Java?",
      options: ["implements", "extends", "inherits", "super"], answer: "extends" },
    { text: "What does the 'abstract' keyword mean for a class?",
      options: ["Cannot be instantiated", "Cannot be extended", "Is static", "Has no methods"], answer: "Cannot be instantiated" },
    { text: "Which method converts a String to an integer?",
      options: ["String.toInt()", "Integer.parseInt()", "Int.valueOf()", "convert()"], answer: "Integer.parseInt()" },
    { text: "What is the difference between ArrayList and LinkedList?",
      options: ["No difference", "ArrayList uses array; LinkedList uses doubly-linked list", "LinkedList is faster for all operations", "ArrayList allows duplicates; LinkedList does not"], answer: "ArrayList uses array; LinkedList uses doubly-linked list" },
    { text: "Which collection maintains insertion order and allows duplicates?",
      options: ["HashSet", "TreeSet", "ArrayList", "HashMap"], answer: "ArrayList" },
    { text: "Can a class implement multiple interfaces in Java?",
      options: ["No", "Yes", "Only two", "Only if they share methods"], answer: "Yes" },
    { text: "What is method overloading?",
      options: ["Same method name, different parameters", "Same method name, same parameters", "Overriding in subclass", "Using multiple return types"], answer: "Same method name, different parameters" },
    { text: "What is method overriding?",
      options: ["Same method name in same class", "Subclass redefines parent class method", "Changing method parameters", "Hiding a method with static"], answer: "Subclass redefines parent class method" },
    { text: "What is the difference between 'throw' and 'throws'?",
      options: ["Same thing", "'throw' throws exception; 'throws' declares it in signature", "'throws' throws exception; 'throw' declares it", "Both declare exceptions"], answer: "'throw' throws exception; 'throws' declares it in signature" },
    { text: "What is a checked exception?",
      options: ["Exception checked at runtime", "Exception checked at compile time", "RuntimeException subclass", "Exception with message"], answer: "Exception checked at compile time" },
    { text: "What does the 'finally' block do?",
      options: ["Runs only if exception occurs", "Runs only if no exception occurs", "Always executes regardless of exception", "Closes the program"], answer: "Always executes regardless of exception" },
    { text: "Which collection class is thread-safe by default?",
      options: ["ArrayList", "HashMap", "Vector", "LinkedList"], answer: "Vector" },
    { text: "What is the difference between HashMap and TreeMap?",
      options: ["No difference", "HashMap is unordered; TreeMap is sorted by key", "TreeMap is faster", "HashMap allows null values; TreeMap does not"], answer: "HashMap is unordered; TreeMap is sorted by key" },
    { text: "What is the Comparable interface method?",
      options: ["compare()", "compareTo()", "equals()", "sort()"], answer: "compareTo()" },
    { text: "What does Collections.sort() require from the objects being sorted?",
      options: ["Serializable", "Cloneable", "Comparable or Comparator", "Iterable"], answer: "Comparable or Comparator" },
    { text: "What is the purpose of generics in Java?",
      options: ["Improve performance", "Type safety at compile time", "Allow dynamic typing", "Speed up collections"], answer: "Type safety at compile time" },
    { text: "What is the difference between abstract class and interface (pre-Java 8)?",
      options: ["No difference", "Abstract class has concrete methods; interface cannot", "Interface can have fields; abstract class cannot", "Both are the same"], answer: "Abstract class has concrete methods; interface cannot" },
    { text: "Can you override a static method in Java?",
      options: ["Yes", "No, static methods are hidden not overridden", "Only in the same class", "Only with @Override"], answer: "No, static methods are hidden not overridden" },
    { text: "What is try-with-resources in Java?",
      options: ["A try block with extra memory", "Auto-closes resources after try block", "A try with multiple catches", "A resource manager"], answer: "Auto-closes resources after try block" },
    { text: "What is the difference between String and StringBuilder?",
      options: ["No difference", "String is immutable; StringBuilder is mutable", "StringBuilder is immutable; String is mutable", "StringBuilder is slower"], answer: "String is immutable; StringBuilder is mutable" },
    { text: "What does the instanceof operator do?",
      options: ["Creates a new object", "Checks if object is instance of a class", "Counts instances", "Compares two objects"], answer: "Checks if object is instance of a class" },
    { text: "What is a default method in an interface (Java 8)?",
      options: ["A method with no body", "A private method", "A method with implementation in interface", "A static method"], answer: "A method with implementation in interface" },
    { text: "What does HashMap.get() return if the key is not found?",
      options: ["0", "\"\"", "Exception", "null"], answer: "null" },
    { text: "What is the initial capacity of ArrayList in Java?",
      options: ["5", "8", "10", "16"], answer: "10" },
    { text: "What is the default load factor of HashMap?",
      options: ["0.5", "0.75", "1.0", "0.25"], answer: "0.75" },
    { text: "What is a Stack data structure?",
      options: ["FIFO - First In First Out", "LIFO - Last In First Out", "Random access", "Sorted structure"], answer: "LIFO - Last In First Out" },
    { text: "What is a Queue data structure?",
      options: ["LIFO - Last In First Out", "FIFO - First In First Out", "Sorted access", "Random access"], answer: "FIFO - First In First Out" },
    { text: "What is the difference between Set and List?",
      options: ["No difference", "Set does not allow duplicates; List does", "List is faster", "Set maintains order; List does not"], answer: "Set does not allow duplicates; List does" },
    { text: "What is encapsulation in Java?",
      options: ["Multiple inheritance", "Hiding internal state using access modifiers", "Creating subclasses", "Reusing code"], answer: "Hiding internal state using access modifiers" },
    { text: "What is the purpose of the @Override annotation?",
      options: ["Creates a new method", "Tells compiler that method overrides parent method", "Hides a method", "Makes method static"], answer: "Tells compiler that method overrides parent method" },
    { text: "What is a LinkedHashMap?",
      options: ["A sorted map", "A HashMap that maintains insertion order", "A thread-safe HashMap", "A map with linked values"], answer: "A HashMap that maintains insertion order" },
    { text: "Which interface does Runnable belong to?",
      options: ["java.io", "java.util", "java.lang", "java.thread"], answer: "java.lang" },
    { text: "What is the difference between final, finally, and finalize?",
      options: ["All are the same", "final=keyword, finally=block, finalize=GC method", "finally=keyword, final=block", "finalize=keyword, final=GC method"], answer: "final=keyword, finally=block, finalize=GC method" },
    { text: "Which method is used to start a Thread in Java?",
      options: ["run()", "begin()", "start()", "execute()"], answer: "start()" },
    { text: "What is an inner class in Java?",
      options: ["A class with private methods", "A class defined inside another class", "A final class", "An abstract class"], answer: "A class defined inside another class" },
    { text: "What does the Comparator interface compare() method take as arguments?",
      options: ["One object", "Two objects of same type", "Two integers", "One string and one integer"], answer: "Two objects of same type" },
    { text: "What is Exception chaining?",
      options: ["Multiple catch blocks", "Linking exceptions with cause", "Rethrowing same exception", "Catching all exceptions"], answer: "Linking exceptions with cause" },
    { text: "Which keyword is used to create a custom exception?",
      options: ["throws", "throw", "extend Exception class", "catch"], answer: "extend Exception class" },
    { text: "What is the PriorityQueue default ordering?",
      options: ["Insertion order", "Random order", "Natural ordering (min-heap)", "Reverse order"], answer: "Natural ordering (min-heap)" },
    { text: "What is abstraction in Java?",
      options: ["Hiding implementation, exposing only essentials", "Showing all details", "Creating multiple objects", "Sorting objects"], answer: "Hiding implementation, exposing only essentials" },
    { text: "Which collection does NOT allow null keys?",
      options: ["HashMap", "LinkedHashMap", "TreeMap", "Hashtable"], answer: "TreeMap" },
    { text: "What does the 'synchronized' keyword do?",
      options: ["Speeds up execution", "Allows only one thread at a time", "Runs threads in parallel", "Stops a thread"], answer: "Allows only one thread at a time" },
    { text: "What is the purpose of Iterator in Java?",
      options: ["Sort elements", "Traverse a collection", "Filter elements", "Count elements"], answer: "Traverse a collection" },
    { text: "What is a lambda expression in Java 8?",
      options: ["A new class type", "Short syntax for anonymous function", "A design pattern", "A thread mechanism"], answer: "Short syntax for anonymous function" },
    { text: "Which Stream method converts a stream to a List?",
      options: ["toArray()", "collect(Collectors.toList())", "asList()", "makeList()"], answer: "collect(Collectors.toList())" }
  ],

  advanced: [
    { text: "Which Java feature best supports functional programming?",
      options: ["Streams", "Lambda expressions", "Generics", "JVM"], answer: "Lambda expressions" },
    { text: "What does 'volatile' ensure for a variable?",
      options: ["Thread safety via locking", "Visibility across threads", "Immutability", "Serialization"], answer: "Visibility across threads" },
    { text: "What is the output of: Optional.of(null)?",
      options: ["null", "Optional.empty()", "NullPointerException", "0"], answer: "NullPointerException" },
    { text: "Which ExecutorService method shuts down gracefully after all tasks finish?",
      options: ["stop()", "terminate()", "shutdown()", "awaitTermination()"], answer: "shutdown()" },
    { text: "What is the purpose of the 'transient' keyword?",
      options: ["Skip serialization of a field", "Make a field thread-safe", "Mark a field as final", "Hide a field"], answer: "Skip serialization of a field" },
    { text: "Which JVM component compiles bytecode to native code at runtime?",
      options: ["ClassLoader", "JIT Compiler", "Garbage Collector", "Interpreter"], answer: "JIT Compiler" },
    { text: "What does Stream.distinct() do?",
      options: ["Sorts elements", "Removes duplicates", "Filters nulls", "Returns unique count"], answer: "Removes duplicates" },
    { text: "What is a functional interface?",
      options: ["Interface with no methods", "Interface with exactly one abstract method", "Interface with static methods", "Interface with default methods only"], answer: "Interface with exactly one abstract method" },
    { text: "Which annotation marks a functional interface?",
      options: ["@Functional", "@Interface", "@FunctionalInterface", "@Lambda"], answer: "@FunctionalInterface" },
    { text: "What is a deadlock in Java?",
      options: ["An infinite loop", "Two threads waiting for each other's locks forever", "A thread that terminates early", "A memory leak"], answer: "Two threads waiting for each other's locks forever" },
    { text: "What is the difference between map() and flatMap() in streams?",
      options: ["No difference", "map transforms each element; flatMap flattens nested streams", "flatMap is slower", "map flattens; flatMap transforms"], answer: "map transforms each element; flatMap flattens nested streams" },
    { text: "What does Optional.orElse() do?",
      options: ["Throws exception if empty", "Returns value if present, else default", "Returns null if empty", "Filters the optional"], answer: "Returns value if present, else default" },
    { text: "What is method reference in Java 8?",
      options: ["A reference variable for methods", "Shorthand for lambda calling existing method", "A way to override methods", "A pointer to method memory"], answer: "Shorthand for lambda calling existing method" },
    { text: "What is the ForkJoinPool used for?",
      options: ["Database connection pooling", "Thread pool for parallel divide-and-conquer tasks", "Scheduling tasks at fixed rate", "Managing I/O operations"], answer: "Thread pool for parallel divide-and-conquer tasks" },
    { text: "What does ClassLoader do in JVM?",
      options: ["Compiles Java code", "Loads class files into JVM memory", "Manages heap memory", "Handles garbage collection"], answer: "Loads class files into JVM memory" },
    { text: "What replaced PermGen in Java 8?",
      options: ["Heap", "Stack", "Metaspace", "Code Cache"], answer: "Metaspace" },
    { text: "What is the difference between heap and stack memory in JVM?",
      options: ["No difference", "Heap stores objects; stack stores method calls and local variables", "Stack stores objects; heap stores primitives", "Both store the same data"], answer: "Heap stores objects; stack stores method calls and local variables" },
    { text: "What is reflection in Java?",
      options: ["Mirror design pattern", "Inspecting and modifying program structure at runtime", "A type of inheritance", "A stream operation"], answer: "Inspecting and modifying program structure at runtime" },
    { text: "What is the Singleton design pattern?",
      options: ["Creates multiple objects", "Ensures only one instance of a class exists", "Creates objects without specifying class", "Delegates object creation"], answer: "Ensures only one instance of a class exists" },
    { text: "What does Stream.reduce() do?",
      options: ["Removes elements", "Reduces stream to single value using accumulator", "Filters elements", "Sorts elements"], answer: "Reduces stream to single value using accumulator" },
    { text: "What is the difference between Runnable and Callable?",
      options: ["No difference", "Runnable returns void; Callable returns a value", "Callable returns void; Runnable returns value", "Both return values"], answer: "Runnable returns void; Callable returns a value" },
    { text: "What does ExecutorService.submit() return?",
      options: ["void", "Thread", "Future object", "Result directly"], answer: "Future object" },
    { text: "What is a CountDownLatch?",
      options: ["A thread lock mechanism", "Synchronizer allowing threads to wait for count to reach zero", "A semaphore", "A blocking queue"], answer: "Synchronizer allowing threads to wait for count to reach zero" },
    { text: "What is a Semaphore in Java?",
      options: ["A type of thread", "Controls access to shared resource using permits", "A lock implementation", "A synchronization barrier"], answer: "Controls access to shared resource using permits" },
    { text: "What is Double-Checked Locking used for?",
      options: ["Double security", "Thread-safe lazy initialization of Singleton", "Locking two resources", "Checking null twice"], answer: "Thread-safe lazy initialization of Singleton" },
    { text: "What is ConcurrentHashMap?",
      options: ["Unsorted HashMap", "Thread-safe HashMap with segment-level locking", "Synchronized ArrayList", "A TreeMap variant"], answer: "Thread-safe HashMap with segment-level locking" },
    { text: "What is the difference between fail-fast and fail-safe iterators?",
      options: ["No difference", "Fail-fast throws ConcurrentModificationException; fail-safe works on copy", "Fail-safe is faster", "Fail-fast works on copy"], answer: "Fail-fast throws ConcurrentModificationException; fail-safe works on copy" },
    { text: "What does @Transactional do in Spring?",
      options: ["Creates REST API", "Manages database transaction boundaries", "Injects dependencies", "Enables caching"], answer: "Manages database transaction boundaries" },
    { text: "What is AOP in Spring?",
      options: ["A database pattern", "Aspect-Oriented Programming for cross-cutting concerns", "A REST design", "An authentication protocol"], answer: "Aspect-Oriented Programming for cross-cutting concerns" },
    { text: "What is the difference between @Component, @Service, @Repository in Spring?",
      options: ["No difference", "All are Spring beans but with semantic layer differences", "@Service is for DB, @Repository for business logic", "@Component is deprecated"], answer: "All are Spring beans but with semantic layer differences" },
    { text: "What does Collectors.groupingBy() do?",
      options: ["Sorts a stream", "Groups stream elements by a classifier function", "Filters duplicates", "Counts elements"], answer: "Groups stream elements by a classifier function" },
    { text: "What is a WeakReference in Java?",
      options: ["A null reference", "A reference that doesn't prevent garbage collection", "A final reference", "A thread-local reference"], answer: "A reference that doesn't prevent garbage collection" },
    { text: "What is the Java Memory Model?",
      options: ["JVM heap structure", "Specification of how threads interact through memory", "Garbage collection algorithm", "Class loading mechanism"], answer: "Specification of how threads interact through memory" },
    { text: "What does the peek() method do in Java Streams?",
      options: ["Terminal operation that prints elements", "Intermediate operation for debugging without consuming stream", "Filters elements", "Sorts elements"], answer: "Intermediate operation for debugging without consuming stream" },
    { text: "What is the happens-before relationship in Java concurrency?",
      options: ["Thread priority ordering", "Guarantee that memory writes are visible to subsequent reads", "Execution order of threads", "Lock acquisition order"], answer: "Guarantee that memory writes are visible to subsequent reads" },
    { text: "What does CompletableFuture.thenApply() do?",
      options: ["Runs in parallel", "Applies function to result when future completes", "Cancels the future", "Waits for future"], answer: "Applies function to result when future completes" },
    { text: "What is the purpose of @Autowired in Spring?",
      options: ["Creates REST endpoints", "Automatically injects dependencies", "Marks a class as a bean", "Manages transactions"], answer: "Automatically injects dependencies" },
    { text: "What is Spring Boot's auto-configuration?",
      options: ["Manual config generation", "Automatically configures Spring app based on classpath", "A build tool", "A testing framework"], answer: "Automatically configures Spring app based on classpath" },
    { text: "What is the difference between @RequestBody and @RequestParam?",
      options: ["No difference", "@RequestBody reads JSON body; @RequestParam reads URL parameters", "@RequestParam reads JSON; @RequestBody reads URL", "Both read the same data"], answer: "@RequestBody reads JSON body; @RequestParam reads URL parameters" },
    { text: "What is JPA in Spring Boot?",
      options: ["A testing library", "Java Persistence API — ORM specification for database operations", "A REST framework", "A build tool"], answer: "Java Persistence API — ORM specification for database operations" },
    { text: "What does the @Entity annotation do in Spring?",
      options: ["Creates a REST endpoint", "Marks a class as a database table", "Injects dependencies", "Enables caching"], answer: "Marks a class as a database table" },
    { text: "What is the difference between EAGER and LAZY fetching in JPA?",
      options: ["No difference", "EAGER loads immediately; LAZY loads when accessed", "LAZY loads immediately; EAGER loads on access", "Both load the same way"], answer: "EAGER loads immediately; LAZY loads when accessed" },
    { text: "What does Stream.filter() do?",
      options: ["Transforms elements", "Returns elements matching a predicate", "Sorts elements", "Reduces to single value"], answer: "Returns elements matching a predicate" },
    { text: "Which G1 GC feature helps reduce pause times?",
      options: ["Full heap collection", "Region-based incremental collection", "Mark-sweep-compact only", "No pause time reduction"], answer: "Region-based incremental collection" },
    { text: "What is ReentrantLock advantage over synchronized?",
      options: ["Faster", "More flexible: tryLock, timed lock, interruptible", "Simpler syntax", "Automatic release"], answer: "More flexible: tryLock, timed lock, interruptible" },
    { text: "What is a BiFunction in Java 8?",
      options: ["A function with no arguments", "Functional interface taking two arguments and returning result", "A method with two return values", "A function that runs twice"], answer: "Functional interface taking two arguments and returning result" },
    { text: "What does @SpringBootApplication include?",
      options: ["Only @Component", "@Configuration + @EnableAutoConfiguration + @ComponentScan", "Only @Autowired", "@Entity + @Repository"], answer: "@Configuration + @EnableAutoConfiguration + @ComponentScan" },
    { text: "What is the purpose of application.properties in Spring Boot?",
      options: ["Java code configuration", "Externalizes application configuration", "Stores SQL queries", "Defines REST endpoints"], answer: "Externalizes application configuration" },
    { text: "What is the difference between PUT and PATCH in REST?",
      options: ["No difference", "PUT replaces entire resource; PATCH updates partially", "PATCH replaces entire resource; PUT updates partially", "Both do the same operation"], answer: "PUT replaces entire resource; PATCH updates partially" },
    { text: "What is Spring Security used for?",
      options: ["Database management", "Authentication and authorization", "API documentation", "Performance monitoring"], answer: "Authentication and authorization" },
    { text: "What does @GeneratedValue(strategy = GenerationType.IDENTITY) do in JPA?",
      options: ["Creates UUID", "Auto-increments primary key using DB identity column", "Generates random ID", "Uses sequence"], answer: "Auto-increments primary key using DB identity column" }
  ]
};

// ── Background canvas (dot grid) ─────────────
(function initBg() {
  const canvas = document.getElementById("bgCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W, H, dots;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildDots();
  }

  function buildDots() {
    dots = [];
    const spacing = 40;
    for (let x = 0; x < W; x += spacing)
      for (let y = 0; y < H; y += spacing)
        dots.push({ x, y, r: Math.random() * .8 + .3, alpha: Math.random() * .4 + .1 });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    dots.forEach(d => {
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(88,212,240,${d.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  draw();
})();

// ── Screen transitions ────────────────────────
function showScreen(name) {
  Object.values(screens).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("active");
  });
  const el = document.getElementById(screens[name]);
  if (el) el.classList.add("active");
}

// ── Level selection ───────────────────────────
levelCards.forEach(card => {
  card.addEventListener("click", () => {
    levelCards.forEach(c => c.classList.remove("active"));
    card.classList.add("active");
    selectedLevel = card.dataset.level;
    validateStart();
  });
});

playerInput.addEventListener("input", validateStart);

function validateStart() {
  const hasName  = playerInput.value.trim().length > 0;
  const hasLevel = selectedLevel !== "";
  startBtn.disabled = !(hasName && hasLevel);
}

// ── Start game ────────────────────────────────
startBtn.addEventListener("click", () => {
  const pool = shuffle([...questionBank[selectedLevel]]);
  questions    = pool.slice(0, QUESTIONS_PER_GAME);
  score        = 0;
  correctCount = 0;
  currentIndex = 0;

  ghLevel.textContent = selectedLevel.toUpperCase();
  showScreen("game");
  loadQuestion();
});

// ── Load question ─────────────────────────────
function loadQuestion() {
  answered = false;
  clearTimer();

  questionCard.style.animation = "none";
  void questionCard.offsetWidth;
  questionCard.style.animation = "";

  const q = questions[currentIndex];
  const total = questions.length;

  ghQnum.textContent       = `Q ${currentIndex + 1} / ${total}`;
  ghScore.textContent      = String(score).padStart(3, "0");
  progressFill.style.width = `${(currentIndex / total) * 100}%`;
  questionText.textContent = q.text;

  feedbackText.textContent = "";
  feedbackText.className   = "";
  nextBtn.classList.add("hidden");

  const shuffledOpts = shuffle([...q.options]);

  optButtons.forEach((btn, i) => {
    btn.textContent   = shuffledOpts[i];
    btn.dataset.key   = ["A","B","C","D"][i];
    btn.disabled      = false;
    btn.className     = "opt-btn";
    btn.onclick = () => checkAnswer(btn, q.answer);
  });

  startTimer();
}

// ── Timer ─────────────────────────────────────
function startTimer() {
  timeLeft = TIMER_SECONDS;
  timerFill.style.width = "100%";
  timerFill.classList.remove("urgent");

  timerInterval = setInterval(() => {
    timeLeft--;
    timerFill.style.width = `${(timeLeft / TIMER_SECONDS) * 100}%`;
    if (timeLeft <= 7) timerFill.classList.add("urgent");
    if (timeLeft <= 0) {
      clearTimer();
      handleTimeout();
    }
  }, 1000);
}

function clearTimer() {
  clearInterval(timerInterval);
}

function handleTimeout() {
  answered = true;
  optButtons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === questions[currentIndex].answer)
      btn.classList.add("reveal");
  });
  feedbackText.textContent = "⏱ Time's up!";
  feedbackText.className   = "feedback-timeout";
  nextBtn.classList.remove("hidden");
}

// ── Check answer ──────────────────────────────
function checkAnswer(selected, correct) {
  if (answered) return;
  answered = true;
  clearTimer();

  optButtons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correct) btn.classList.add("correct");
  });

  if (selected.textContent === correct) {
    score++;
    correctCount++;
    selected.classList.add("correct");
    feedbackText.textContent = "✓ Correct!";
    feedbackText.className   = "feedback-correct";
  } else {
    selected.classList.add("wrong");
    feedbackText.textContent = `✗ Answer: ${correct}`;
    feedbackText.className   = "feedback-wrong";
  }

  ghScore.textContent = String(score).padStart(3, "0");
  nextBtn.classList.remove("hidden");
}

// ── Next question ─────────────────────────────
nextBtn.addEventListener("click", advance);

document.addEventListener("keydown", e => {
  if (e.key === "Enter" && !nextBtn.classList.contains("hidden")) advance();
  if (!answered) {
    const map = { "1": 0, "2": 1, "3": 2, "4": 3, "a": 0, "b": 1, "c": 2, "d": 3 };
    const idx = map[e.key.toLowerCase()];
    if (idx !== undefined && optButtons[idx] && !optButtons[idx].disabled)
      optButtons[idx].click();
  }
});

function advance() {
  currentIndex++;
  if (currentIndex < questions.length) {
    loadQuestion();
  } else {
    endGame();
  }
}

// ── End game ──────────────────────────────────
function endGame() {
  progressFill.style.width = "100%";
  const total    = questions.length;
  const accuracy = Math.round((correctCount / total) * 100);
  const msgs = [
    [0,  49,  "Keep practising! You'll get there. 💪"],
    [50, 74,  "Good effort! Review the missed ones. 📚"],
    [75, 89,  "Great job! Almost a master! 🌟"],
    [90, 100, "Outstanding! Java master unlocked! 🏆"]
  ];
  const msg = msgs.find(([lo, hi]) => accuracy >= lo && accuracy <= hi)?.[2] ?? "";

  document.getElementById("resultBadge").textContent =
    accuracy >= 90 ? "🏆" : accuracy >= 75 ? "🌟" : accuracy >= 50 ? "👏" : "💪";
  document.getElementById("resultTitle").textContent =
    accuracy >= 90 ? "Master Level!" : accuracy >= 75 ? "Well Done!" : accuracy >= 50 ? "Good Try!" : "Keep Going!";
  document.getElementById("resultScore").textContent  = correctCount;
  document.getElementById("resultTotal").textContent  = `/ ${total}`;
  document.getElementById("resultMsg").textContent    = msg;

  document.getElementById("resultStats").innerHTML = `
    <div class="stat-box"><span class="stat-val">${accuracy}%</span><span class="stat-lbl">ACCURACY</span></div>
    <div class="stat-box"><span class="stat-val">${correctCount}</span><span class="stat-lbl">CORRECT</span></div>
    <div class="stat-box"><span class="stat-val">${total - correctCount}</span><span class="stat-lbl">WRONG</span></div>
  `;

  showScreen("result");
  sendScore();
}

// ── Play again ────────────────────────────────
playAgainBtn.addEventListener("click", () => {
  selectedLevel = "";
  levelCards.forEach(c => c.classList.remove("active"));
  startBtn.disabled = true;
  showScreen("intro");
});

// ── Save score to backend ─────────────────────
function sendScore() {
  const playerName = playerInput.value.trim();
  if (!playerName) return;

  fetch(`${BASE_URL}/api/score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playerName, level: selectedLevel, score })
  })
  .then(r => r.json())
  .then(d => console.log("Score saved:", d))
  .catch(err => console.warn("Backend unavailable:", err));
}

// ── Utility ───────────────────────────────────
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}