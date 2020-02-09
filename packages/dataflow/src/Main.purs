module Main (just, nothing, SNode(..), nodeValue) where

import Prelude
import Data.Maybe (Maybe(..))

-- Reexports are not supported so I have to do this
just :: forall a. a -> Maybe a
just = Just

nothing :: forall a. Maybe a
nothing = Nothing

data SNode a b
  = Constant b
  | Arrow (SNode a a) (a -> Maybe b)
  | Pipe (SNode a a) (SNode a (a -> Maybe b))

nodeValue :: forall a b. SNode a b -> Maybe b
nodeValue node = case node of
  Constant o -> Just o
  Arrow input lambda -> nodeValue input >>= lambda
  Pipe input lambda -> join $ nodeValue lambda <*> nodeValue input
