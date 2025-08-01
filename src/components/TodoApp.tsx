import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

type FilterType = "all" | "active" | "completed";

export const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: inputValue.trim(),
        completed: false,
        createdAt: new Date(),
      };
      setTodos([newTodo, ...todos]);
      setInputValue("");
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const activeTodoCount = todos.filter(todo => !todo.completed).length;
  const completedTodoCount = todos.filter(todo => todo.completed).length;

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Todo List
          </h1>
          <p className="text-muted-foreground">
            Stay organized and productive
          </p>
        </div>

        {/* Add Todo Input */}
        <Card className="mb-6 shadow-elegant border-0">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <Input
                placeholder="Add a new task..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTodo()}
                className="flex-1 border-0 bg-secondary/50 focus:bg-background transition-colors"
              />
              <Button 
                onClick={addTodo}
                className="bg-gradient-primary hover:shadow-hover transition-all duration-300 px-6"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="flex justify-center gap-4 mb-6">
          <Badge variant="secondary" className="px-4 py-2">
            {activeTodoCount} Active
          </Badge>
          <Badge variant="outline" className="px-4 py-2 border-success text-success">
            {completedTodoCount} Completed
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            {todos.length} Total
          </Badge>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-2 mb-6">
          {(["all", "active", "completed"] as FilterType[]).map((filterType) => (
            <Button
              key={filterType}
              variant={filter === filterType ? "default" : "ghost"}
              onClick={() => setFilter(filterType)}
              className={cn(
                "capitalize transition-smooth",
                filter === filterType && "bg-gradient-primary shadow-elegant"
              )}
            >
              {filterType}
            </Button>
          ))}
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          {filteredTodos.length === 0 ? (
            <Card className="shadow-card border-0">
              <CardContent className="p-8 text-center">
                <Circle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {filter === "all" 
                    ? "No tasks yet. Add one above!"
                    : filter === "active"
                    ? "No active tasks. Great job!"
                    : "No completed tasks yet."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredTodos.map((todo, index) => (
              <Card 
                key={todo.id}
                className={cn(
                  "shadow-card border-0 transition-smooth hover:shadow-hover animate-fade-in",
                  todo.completed && "opacity-75"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleTodo(todo.id)}
                      className={cn(
                        "p-1 h-auto transition-smooth hover:scale-110",
                        todo.completed 
                          ? "text-success hover:text-success" 
                          : "text-muted-foreground hover:text-primary"
                      )}
                    >
                      {todo.completed ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </Button>
                    
                    <span 
                      className={cn(
                        "flex-1 transition-smooth",
                        todo.completed 
                          ? "line-through text-muted-foreground" 
                          : "text-foreground"
                      )}
                    >
                      {todo.text}
                    </span>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTodo(todo.id)}
                      className="p-1 h-auto text-muted-foreground hover:text-destructive transition-smooth hover:scale-110"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Footer */}
        {todos.length > 0 && (
          <div className="text-center mt-8 text-sm text-muted-foreground">
            {activeTodoCount > 0 
              ? `${activeTodoCount} task${activeTodoCount === 1 ? '' : 's'} remaining`
              : "All tasks completed! 🎉"
            }
          </div>
        )}
      </div>
    </div>
  );
};