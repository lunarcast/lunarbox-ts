module Main where

import Prelude
import Data.Maybe (Maybe(..))

data SNode a b
  = Constant b
  | Arrow (SNode a a) (a -> b)
  | Pipe (SNode a (Function a b)) (SNode a a)

nodeValue :: forall a b. SNode a b -> Maybe b
nodeValue node = case node of
  Constant o -> Just o
  Arrow i o -> o <$> nodeValue i
  Pipe i o -> nodeValue i <*> nodeValue o
