module Graph where

data SNode a b
  = Constant b
  | Arrow (SNode a a) (a -> b)
  | Pipe (SNode a (Function a b)) (SNode a a)
