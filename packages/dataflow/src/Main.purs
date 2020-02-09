module Main where

import Prelude
import Effect (Effect)
import Effect.Console (logShow)
import Graph (SNode(..))

a :: SNode Int Int
a = Arrow (Constant 4) (\i -> i * 2)

nodeValue :: forall a b. SNode a b -> b
nodeValue node = case node of
  Constant o -> o
  Arrow i o -> o $ nodeValue i
  Pipe i o -> nodeValue i $ nodeValue o

main :: Effect Unit
main = do
  logShow $ nodeValue a
