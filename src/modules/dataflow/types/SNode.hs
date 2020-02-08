-- This is not actual haskell. 
-- This is transformed into TypeScript by fp-ts-codegen 
data SNode (A :: Label) (B :: Label) 
    = SArrow (LabelT A B) (() -> SNodeWithOutput A)
    | SConstant (LabelValue B) B
    | SPipe (() -> SNodeWithOutput (ArrowLabel A B)) (() -> SNodeWithOutput A)
