﻿using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities;

public class BoardColumn : BaseEntity
{
    public string Name { get; set; } = "";

    public int BoardId { get; set; }
    public Board Board { get; set; }
}
