-- This is not actual haskell. 
-- This is transformed into TypeScript by fp-ts-codegen 
data SNode (A :: Label) (B :: Label) 
    = SArrow (LabelT A B) (() -> SNode Label B)
    | SConstant B
    | SPipe (() -> SNode Label (ArrowLabel A B)) (() -> SNode Label A)
